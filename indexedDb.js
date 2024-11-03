// wwwroot/indexedDb.js

// Open the database
function openDb() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("MyDatabase", 2);

        request.onupgradeneeded = event => {
            const db = event.target.result;

            // Create products store if it doesn't exist
            if (!db.objectStoreNames.contains("products")) {
                db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
            }

            // Create users store if it doesn't exist
            if (!db.objectStoreNames.contains("users")) {
                const userStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
                userStore.createIndex("UserName", "UserName", { unique: true });

                // Seed with initial user data
                userStore.transaction.oncomplete = () => {
                    const userObjectStore = db.transaction("users", "readwrite").objectStore("users");
                    userObjectStore.add({
                        UserName: "DECO",
                        UserPassword: "D3k0",
                        FirstName: "Default",
                        LastName: "User",
                        RoleId: 1, 
                        IsActive: true,
                        CreatedBy: "system",
                        CreatedDate: new Date(),
                        ModifiedBy: "system",
                        ModifiedDate: null,
                        FromServer: false
                    });
                };
            }
        };

        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onerror = event => {
            reject(event.target.error);
        };
    });
}
// Get saved username from IndexedDB
function getSavedUsername(username) {
    return new Promise((resolve, reject) => {
        openDb().then(db => {
            const transaction = db.transaction("users", "readonly");
            const store = transaction.objectStore("users");
            const index = store.index("UserName");
            const request = index.get(username);

            request.onsuccess = () => {
                if (request.result && request.result.IsActive) {
                    resolve(request.result.UserName);
                } else {
                    resolve(null);
                }
            };

            request.onerror = event => {
                reject(event.target.error);
            };
        });
    });
}

function markUserAsAuthenticated(username) {
    openDb().then(db => {
        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");
        const index = store.index("UserName");
        const request = index.get(username);

        request.onsuccess = () => {
            if (request.result) {
                const user = request.result;
                user.IsActive = true;
                store.put(user); // Update the user's status
            }
        };
    });
}

function markUserAsLoggedOut(username) {
    openDb().then(db => {
        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");
        const index = store.index("UserName");
        const request = index.get(username);

        request.onsuccess = () => {
            if (request.result) {
                const user = request.result;
                user.IsActive = false;
                store.put(user);
            }
        };
    });
}



// Add a product
function addProduct(product) {
    return new Promise((resolve, reject) => {
        openDb().then(db => {
            const transaction = db.transaction("products", "readwrite");
            const store = transaction.objectStore("products");
            const request = store.add(product);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = event => {
                reject(event.target.error);
            };
        });
    });
}

// Get all products
function getAllProducts() {
    return new Promise((resolve, reject) => {
        openDb().then(db => {
            const transaction = db.transaction("products", "readonly");
            const store = transaction.objectStore("products");
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = event => {
                reject(event.target.error);
            };
        });
    });
}

// Get product by ID
function getProductById(id) {
    return new Promise((resolve, reject) => {
        openDb().then(db => {
            const transaction = db.transaction("products", "readonly");
            const store = transaction.objectStore("products");
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = event => {
                reject(event.target.error);
            };
        });
    });
}

// Get record by a specific field
function getRecordByField(storeName, fieldName, value) {
    return new Promise((resolve, reject) => {
        openDb().then(db => {
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const index = store.index(fieldName);
            const request = index.get(value);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = event => {
                reject(event.target.error);
            };
        });
    });
}

// Update a product
function updateProduct(product) {
    return new Promise((resolve, reject) => {
        openDb().then(db => {
            const transaction = db.transaction("products", "readwrite");
            const store = transaction.objectStore("products");
            const request = store.put(product);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = event => {
                reject(event.target.error);
            };
        });
    });
}

// Delete a product
function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        openDb().then(db => {
            const transaction = db.transaction("products", "readwrite");
            const store = transaction.objectStore("products");
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = event => {
                reject(event.target.error);
            };
        });
    });
}
