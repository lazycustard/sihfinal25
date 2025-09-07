<!-- Dont forget to update README before making any new changes or introducing any new dependencies -->

# SIH25 – QR generation logic
This backend generates **unique QR codes** for products.  
It uses [uv](https://docs.astral.sh/uv/) (a fast Python package manager) and [qrcode](https://pypi.org/project/qrcode/).  
[Flask](https://flask.palletsprojects.com/) is also installed for future API development but is **not currently used**.

---

## 🚀 Prerequisites
- Python **3.12.3**
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (fast Python package manager)
- Git

---

## ⚡ Installation

### 1. Clone the repo
```bash
git clone https://github.com/anshulbadhani/sih25.git
cd sih25/backend
```

### 2. Install (uv if not installed already)
- Follow instruction as mentioned at [Installation | uv](https://docs.astral.sh/uv/getting-started/installation/)
- Verify using
    ```bash
    uv --version
    ```

### 3. Sync Dependecies
```bash
uv sync
```

### 4. Run the script
```bash
uv run python main.py
```

--- 

## Team workflow / How to contribute
Just remember to use ```git pull``` command before modifying the repository

## Proposed Folder Sturcture
This is how I imagine to inlcude this repo in the existing codebase (maybe it would be better to make a new organisation and write code there)
```bash
<Root Directory>
|–– Frontend/
|–– Backend/
    |–– QR_Logic/ (this repository)
        |–– ...
    |–– Other Stuff/
|–– Misc
