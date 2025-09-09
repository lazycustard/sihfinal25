package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Product struct {
	ProductID     string        `json:"productId"`
	ProductType   string        `json:"productType"`
	BatchSize     string        `json:"batchSize"`
	HarvestDate   string        `json:"harvestDate"`
	Status        string        `json:"status"` // "ACTIVE" | "COMPLETED"
	Transactions  []Transaction `json:"transactions"`
	CreatedAt     string        `json:"createdAt"`
	UpdatedAt     string        `json:"updatedAt"`
}

type Transaction struct {
	Role        string `json:"role"`        // "Farmer", "Distributor", "Retailer"
	Name        string `json:"name"`        // Entity name
	Location    string `json:"location"`    // Entity location
	Timestamp   string `json:"timestamp"`   // Transaction timestamp
	HandlingInfo string `json:"handlingInfo,omitempty"` // Optional handling details
	TransactionID string `json:"transactionId"` // Unique transaction ID
}

type FarmerDetails struct {
	Name        string `json:"name"`
	Location    string `json:"location"`
	ContactInfo string `json:"contactInfo,omitempty"`
}

type ProductDetails struct {
	ProductType string `json:"productType"`
	BatchSize   string `json:"batchSize"`
	HarvestDate string `json:"harvestDate"`
	Quality     string `json:"quality,omitempty"`
	Organic     bool   `json:"organic,omitempty"`
}

// ---------- utils ----------

func (s *SmartContract) productExists(ctx contractapi.TransactionContextInterface, productId string) (bool, error) {
	b, err := ctx.GetStub().GetState(productId)
	if err != nil {
		return false, err
	}
	return b != nil, nil
}

func getClientMSP(ctx contractapi.TransactionContextInterface) (string, error) {
	id := ctx.GetClientIdentity()
	return id.GetMSPID()
}

func generateTransactionID() string {
	return fmt.Sprintf("TXN-%d", time.Now().UnixNano())
}

// ---------- Product Registration ----------

func (s *SmartContract) RegisterProduct(ctx contractapi.TransactionContextInterface, productId string, farmerDetailsJSON string, productDetailsJSON string) error {
	exists, err := s.productExists(ctx, productId)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("product %s already exists", productId)
	}

	var farmerDetails FarmerDetails
	if err := json.Unmarshal([]byte(farmerDetailsJSON), &farmerDetails); err != nil {
		return fmt.Errorf("invalid farmer details JSON: %v", err)
	}

	var productDetails ProductDetails
	if err := json.Unmarshal([]byte(productDetailsJSON), &productDetails); err != nil {
		return fmt.Errorf("invalid product details JSON: %v", err)
	}

	now := time.Now().UTC().Format(time.RFC3339)
	
	// Create initial transaction for farmer registration
	initialTransaction := Transaction{
		Role:          "Farmer",
		Name:          farmerDetails.Name,
		Location:      farmerDetails.Location,
		Timestamp:     now,
		HandlingInfo:  fmt.Sprintf("Product registered - %s", productDetails.ProductType),
		TransactionID: generateTransactionID(),
	}

	product := Product{
		ProductID:    productId,
		ProductType:  productDetails.ProductType,
		BatchSize:    productDetails.BatchSize,
		HarvestDate:  productDetails.HarvestDate,
		Status:       "ACTIVE",
		Transactions: []Transaction{initialTransaction},
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	productJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(productId, productJSON)
}

// ---------- Ownership Transfer ----------

func (s *SmartContract) TransferOwnership(ctx contractapi.TransactionContextInterface, productId string, newOwnerRole string, newOwnerName string, newOwnerLocation string, handlingInfo string) error {
	productJSON, err := ctx.GetStub().GetState(productId)
	if err != nil {
		return err
	}
	if productJSON == nil {
		return fmt.Errorf("product %s not found", productId)
	}

	var product Product
	if err := json.Unmarshal(productJSON, &product); err != nil {
		return err
	}

	if product.Status == "COMPLETED" {
		return fmt.Errorf("product %s is already completed; no further transfers allowed", productId)
	}

	now := time.Now().UTC().Format(time.RFC3339)
	
	newTransaction := Transaction{
		Role:          newOwnerRole,
		Name:          newOwnerName,
		Location:      newOwnerLocation,
		Timestamp:     now,
		HandlingInfo:  handlingInfo,
		TransactionID: generateTransactionID(),
	}

	product.Transactions = append(product.Transactions, newTransaction)
	product.UpdatedAt = now

	updatedProductJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(productId, updatedProductJSON)
}

// ---------- Complete Product Journey ----------

func (s *SmartContract) CompleteProduct(ctx contractapi.TransactionContextInterface, productId string, consumerInfo string) error {
	productJSON, err := ctx.GetStub().GetState(productId)
	if err != nil {
		return err
	}
	if productJSON == nil {
		return fmt.Errorf("product %s not found", productId)
	}

	var product Product
	if err := json.Unmarshal(productJSON, &product); err != nil {
		return err
	}

	if product.Status == "COMPLETED" {
		return fmt.Errorf("product %s is already completed", productId)
	}

	now := time.Now().UTC().Format(time.RFC3339)
	
	finalTransaction := Transaction{
		Role:          "Consumer",
		Name:          "End Consumer",
		Location:      "Point of Sale",
		Timestamp:     now,
		HandlingInfo:  fmt.Sprintf("Product verified by consumer: %s", consumerInfo),
		TransactionID: generateTransactionID(),
	}

	product.Transactions = append(product.Transactions, finalTransaction)
	product.Status = "COMPLETED"
	product.UpdatedAt = now

	updatedProductJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}

	if err := ctx.GetStub().PutState(productId, updatedProductJSON); err != nil {
		return err
	}

	// Emit event for product completion
	eventPayload, _ := json.Marshal(map[string]string{"productId": productId, "status": product.Status})
	if err := ctx.GetStub().SetEvent("ProductCompleted", eventPayload); err != nil {
		return err
	}

	return nil
}

// ---------- Query Functions ----------

func (s *SmartContract) GetProductHistory(ctx contractapi.TransactionContextInterface, productId string) (*Product, error) {
	productJSON, err := ctx.GetStub().GetState(productId)
	if err != nil {
		return nil, err
	}
	if productJSON == nil {
		return nil, fmt.Errorf("product %s not found", productId)
	}

	var product Product
	if err := json.Unmarshal(productJSON, &product); err != nil {
		return nil, err
	}

	return &product, nil
}

func (s *SmartContract) GetAllProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var products []*Product
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var product Product
		if err := json.Unmarshal(queryResponse.Value, &product); err != nil {
			continue // Skip invalid records
		}

		products = append(products, &product)
	}

	return products, nil
}

func main() {
	cc, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		panic(err)
	}
	if err := cc.Start(); err != nil {
		panic(err)
	}
}
