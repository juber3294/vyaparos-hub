// Demo data for VyaparOS — Indian wholesale/retail business
export const company = {
  name: "Sharma Traders Pvt Ltd",
  gstin: "27AAECS1234F1Z5",
  city: "Mumbai, MH",
  owner: "Rajesh Sharma",
};

const firstNames = ["Rajesh","Priya","Amit","Sneha","Vikram","Anjali","Rahul","Neha","Suresh","Kavita","Arjun","Pooja","Manish","Deepa","Karan","Ritu","Sanjay","Meera","Anil","Divya"];
const lastNames = ["Sharma","Patel","Verma","Iyer","Reddy","Mehta","Kapoor","Nair","Gupta","Joshi","Malhotra","Singh","Agarwal","Chopra","Bhat","Rao"];
const cities = ["Mumbai","Delhi","Bengaluru","Ahmedabad","Pune","Chennai","Kolkata","Hyderabad","Jaipur","Surat","Lucknow","Indore"];
const gstStatePrefixes = ["27","07","29","24","27","33","19","36","08","24","09","23"];

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};
const r = rand(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];

export type Customer = {
  id: string; name: string; phone: string; city: string;
  gstin: string; pan: string; outstanding: number; creditLimit: number;
  address: string;
};

export const customers: Customer[] = Array.from({ length: 20 }, (_, i) => {
  const fn = pick(firstNames), ln = pick(lastNames);
  const cityIdx = Math.floor(r() * cities.length);
  const name = `${fn} ${ln} ${i % 3 === 0 ? "Enterprises" : i % 3 === 1 ? "Traders" : "& Sons"}`;
  return {
    id: `CUST-${1001 + i}`,
    name,
    phone: `+91 ${Math.floor(70000 + r() * 29999)}${Math.floor(10000 + r() * 89999)}`,
    city: cities[cityIdx],
    gstin: `${gstStatePrefixes[cityIdx]}${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${Math.floor(1000 + r()*8999)}${String.fromCharCode(65 + Math.floor(r()*26))}1Z${Math.floor(r()*9)}`,
    pan: `${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${String.fromCharCode(65 + Math.floor(r()*26))}${Math.floor(1000 + r()*8999)}${String.fromCharCode(65 + Math.floor(r()*26))}`,
    outstanding: Math.floor(r() * 250000),
    creditLimit: Math.floor(100000 + r() * 900000),
    address: `${Math.floor(1 + r()*200)}, ${pick(["MG Road","Nehru Nagar","Shivaji Path","Gandhi Marg","Sector 12","Ring Road"])}, ${cities[cityIdx]}`,
  };
});

export type Supplier = {
  id: string; name: string; phone: string; city: string;
  gstin: string; outstanding: number; totalPurchase: number;
};

export const suppliers: Supplier[] = Array.from({ length: 15 }, (_, i) => {
  const cityIdx = Math.floor(r() * cities.length);
  const brands = ["Kumar Distributors","Bharat Wholesale","Deccan Supplies","Ganga Trading","Krishna Agencies","Om Industries","Shree Enterprises","Vaibhav Traders","Ashok Suppliers","Jai Bharat Co","Sundaram Distributors","Rajwada Wholesale","Delhi Bazaar","Surat Textiles","Chennai Imports"];
  return {
    id: `SUPP-${2001 + i}`,
    name: brands[i],
    phone: `+91 ${Math.floor(70000 + r() * 29999)}${Math.floor(10000 + r() * 89999)}`,
    city: cities[cityIdx],
    gstin: `${gstStatePrefixes[cityIdx]}AABCS${Math.floor(1000 + r()*8999)}Q1Z${Math.floor(r()*9)}`,
    outstanding: Math.floor(r() * 400000),
    totalPurchase: Math.floor(500000 + r() * 4500000),
  };
});

export type Product = {
  id: string; name: string; sku: string; barcode: string;
  category: string; brand: string; hsn: string; gst: number;
  purchasePrice: number; sellingPrice: number; stock: number;
  minStock: number; warehouse: string;
};

const productSeeds = [
  ["Basmati Rice 5kg","Grocery","India Gate","10063020",5],
  ["Toor Dal 1kg","Grocery","Tata Sampann","07131060",5],
  ["Sunflower Oil 5L","Grocery","Fortune","15121110",5],
  ["Wheat Atta 10kg","Grocery","Aashirvaad","11010000",5],
  ["Sugar 1kg","Grocery","Madhur","17019910",5],
  ["Tea 500g","Beverages","Tata Tea Gold","09024030",12],
  ["Coffee 200g","Beverages","Bru Instant","09011990",18],
  ["Bisleri 1L (Case)","Beverages","Bisleri","22011010",18],
  ["Coca Cola 2L","Beverages","Coca Cola","22021010",28],
  ["Parle-G Biscuit","Snacks","Parle","19053100",18],
  ["Kurkure Masala","Snacks","PepsiCo","19059030",12],
  ["Lays Classic","Snacks","PepsiCo","20052000",12],
  ["Haldiram Bhujia","Snacks","Haldiram","20081910",12],
  ["Colgate MaxFresh","Personal Care","Colgate","33061010",18],
  ["Dove Soap 100g","Personal Care","HUL","34011190",18],
  ["Head & Shoulders","Personal Care","P&G","33051010",18],
  ["Nivea Cream 200ml","Personal Care","Nivea","33049990",18],
  ["Ariel Detergent 1kg","Household","P&G","34022090",18],
  ["Vim Bar 300g","Household","HUL","34011190",18],
  ["Harpic 1L","Household","Reckitt","34022090",18],
  ["Godrej Aer Spray","Household","Godrej","33074900",18],
  ["Amul Butter 500g","Dairy","Amul","04051000",12],
  ["Mother Dairy Ghee 1L","Dairy","Mother Dairy","04051000",12],
  ["Nestle Milkmaid","Dairy","Nestle","04029910",12],
  ["Britannia Cheese","Dairy","Britannia","04061000",12],
  ["Maggi 2min Noodles","Instant","Nestle","19023010",18],
  ["MTR Ready Meal","Instant","MTR","21069099",18],
  ["Knorr Soup","Instant","HUL","21041010",18],
  ["Everest Garam Masala","Spices","Everest","09109990",5],
  ["MDH Chana Masala","Spices","MDH","09109990",5],
  ["Catch Black Pepper","Spices","Catch","09041110",5],
  ["Tata Salt 1kg","Spices","Tata","25010020",5],
  ["Cadbury Dairy Milk","Confectionery","Cadbury","17049090",18],
  ["Ferrero Rocher T16","Confectionery","Ferrero","18069030",18],
  ["KitKat 4-finger","Confectionery","Nestle","18069030",18],
  ["Mentos Fruit","Confectionery","Perfetti","17049090",18],
  ["Ceat Bike Tyre","Automotive","Ceat","40112090",28],
  ["Castrol Engine Oil 1L","Automotive","Castrol","27101981",18],
  ["Exide Battery 35Ah","Automotive","Exide","85071000",28],
  ["Bosch Wiper Blade","Automotive","Bosch","85122010",18],
  ["Philips LED Bulb 9W","Electrical","Philips","85395000",12],
  ["Havells Fan","Electrical","Havells","84145100",18],
  ["Anchor Switch 6A","Electrical","Anchor","85365020",18],
  ["Bajaj Iron 1000W","Electrical","Bajaj","85164000",18],
];

export const products: Product[] = productSeeds.map(([name, category, brand, hsn, gst], i) => {
  const purchase = Math.floor(50 + r() * 1450);
  const margin = 1.15 + r() * 0.35;
  const stock = Math.floor(r() * 300);
  return {
    id: `PRD-${3001 + i}`,
    name: String(name),
    sku: `SKU-${String(3001 + i)}`,
    barcode: `890${Math.floor(1000000000 + r() * 8999999999)}`,
    category: String(category),
    brand: String(brand),
    hsn: String(hsn),
    gst: Number(gst),
    purchasePrice: purchase,
    sellingPrice: Math.floor(purchase * margin),
    stock,
    minStock: 15,
    warehouse: pick(["Main WH","Andheri WH","Thane WH"]),
  };
});

export type InvoiceStatus = "Paid" | "Pending" | "Partial" | "Overdue";
export type Invoice = {
  id: string; number: string; customerId: string; customerName: string;
  date: string; amount: number; gst: number; total: number;
  status: InvoiceStatus; items: number;
};

export const invoices: Invoice[] = Array.from({ length: 32 }, (_, i) => {
  const c = customers[Math.floor(r() * customers.length)];
  const amount = Math.floor(5000 + r() * 195000);
  const gst = Math.round(amount * 0.18);
  const statuses: InvoiceStatus[] = ["Paid","Paid","Pending","Partial","Overdue","Paid"];
  const d = new Date(2026, 6, Math.floor(1 + r() * 11));
  return {
    id: `INV-${5001 + i}`,
    number: `VYP/2026-27/${String(1001 + i)}`,
    customerId: c.id,
    customerName: c.name,
    date: d.toISOString().slice(0, 10),
    amount,
    gst,
    total: amount + gst,
    status: pick(statuses),
    items: Math.floor(2 + r() * 12),
  };
});

export const monthlySales = [
  { m: "Feb", sales: 842000, purchase: 612000 },
  { m: "Mar", sales: 1120000, purchase: 780000 },
  { m: "Apr", sales: 984000, purchase: 702000 },
  { m: "May", sales: 1340000, purchase: 890000 },
  { m: "Jun", sales: 1580000, purchase: 1040000 },
  { m: "Jul", sales: 1720000, purchase: 1150000 },
];

export const topCustomers = customers
  .slice(0, 6)
  .map((c, i) => ({ name: c.name.split(" ").slice(0, 2).join(" "), value: Math.floor(180000 - i * 22000) }));

export const topProducts = products.slice(0, 6).map((p, i) => ({
  name: p.name, sold: Math.floor(340 - i * 40), revenue: Math.floor(240000 - i * 28000),
}));

export const categoryMix = [
  { name: "Grocery", value: 32 },
  { name: "Beverages", value: 18 },
  { name: "Personal Care", value: 14 },
  { name: "Snacks", value: 12 },
  { name: "Dairy", value: 10 },
  { name: "Others", value: 14 },
];

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const employees = [
  { id: "EMP-01", name: "Rajesh Sharma", role: "Owner", phone: "+91 98200 12345", dept: "Management" },
  { id: "EMP-02", name: "Priya Iyer", role: "Accountant", phone: "+91 98202 33456", dept: "Finance" },
  { id: "EMP-03", name: "Amit Verma", role: "Sales Manager", phone: "+91 98203 44567", dept: "Sales" },
  { id: "EMP-04", name: "Sneha Nair", role: "Inventory Head", phone: "+91 98204 55678", dept: "Warehouse" },
  { id: "EMP-05", name: "Vikram Singh", role: "Delivery Lead", phone: "+91 98205 66789", dept: "Logistics" },
  { id: "EMP-06", name: "Anjali Kapoor", role: "Cashier", phone: "+91 98206 77890", dept: "Store" },
  { id: "EMP-07", name: "Rahul Gupta", role: "Sales Executive", phone: "+91 98207 88901", dept: "Sales" },
  { id: "EMP-08", name: "Neha Mehta", role: "HR Executive", phone: "+91 98208 99012", dept: "HR" },
];
