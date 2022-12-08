import testController from "./testController.js";

var samples = [
    {
        image: "product-images/sample-product1.jpg",
        code: "N1234",
        name: "Phoenix Necklace",
        type: "Necklace",
        brand: "Cartier",
        classification: "14 karat",
        design: "regular",
        size: 16,
        weight: 10,
        available: 100,
        sellingType: "per gram",
        purchasePrice: 5000,
        sellingPrice: 10000,
        dateAdded: "10/1/2022",
        dateUpdated: "10/31/2022",
        addedBy: "admin",
    },
    {
        image: "product-images/sample-product2.jpg",
        code: "N5678",
        name: "Saudi Gold Tiffany Necklace",
        type: "Necklace",
        brand: "Tiffany",
        classification: "18 karat",
        design: "regular",
        size: 18,
        weight: 20,
        available: 140,
        sellingType: "per gram",
        purchasePrice: 8000,
        sellingPrice: 18000,
        dateAdded: "10/2/2022",
        dateUpdated: "10/31/2022",
        addedBy: "admin",
    },
    {
        image: "product-images/sample-product3.jpg",
        code: "C789",
        name: "VVsplChristian Dior Saudi Gold Cadena Chain",
        type: "Chain",
        brand: "Swarovski",
        classification: "18 karat",
        design: "regular",
        size: 22,
        weight: 18,
        available: 0,
        sellingType: "per gram",
        purchasePrice: 20000,
        sellingPrice: 40000,
        dateAdded: "10/21/2022",
        dateUpdated: "10/31/2022",
        addedBy: "admin",
    },
];

const sample = {
    initializeSamples: async function () {
        if (process.env.NODE_ENV === "development") {
            //Add admin user to database
            console.log("Development mode: Adding admin user to database");
            testController.addAdmin();

            //Add sample items to database
            console.log("Development mode: Adding sample items to database");
            testController.addItemSamples(samples);
        }
    },
};

export default sample;
