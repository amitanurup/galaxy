# ME24x7 Service Desk

Local-first IT service and repair desk for store receive entries, engineer updates, and product inventory.

## Run Locally

```bash
npm install
npm run dev
```

For same Wi-Fi mobile testing, run:

```bash
npm run dev:lan
```

Open the local URL shown by Vite. In this workspace the mobile LAN URL is:

```text
http://192.168.68.124:5178/
```

## Local Login IDs

```text
Admin:    ADMIN  / 1234
Engineer: ENG-01 / 1111
Engineer: ENG-02 / 2222
Engineer: ENG-03 / 3333
```

## What Works Now

- Customer receive entry with name, mobile number, product name, serial number, problem, engineer, and product photo.
- Product photo can be captured from the mobile camera or uploaded from gallery.
- Product photos are auto-compressed in the browser to stay under 100 KB when captured or uploaded.
- Product serial number can be scanned with a mobile barcode camera on supported browsers. On PC, a USB barcode reader can type into the serial number field.
- When a product is marked delivered, the saved product photo is compressed again for smaller storage.
- Admin can see all service jobs and repair status.
- Engineers can receive products and update repair status.
- Repair note field stores what repair was done.
- Inventory lets admin add product/service name, price, and stock.
- In dev mode, data syncs through a local `/api/data` store so admin and engineer devices on the same Wi-Fi can see updates. It also keeps a browser `localStorage` fallback.

## Later Online Upgrade

When you are ready to use it from multiple mobiles/computers, this app can be connected to an online backend with real users, shared database, photo storage, and live updates.
