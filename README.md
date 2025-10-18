# MeadTools Desktop _(Deprecated)_

> ⚠️ **Important Notice:**  
> MeadTools Desktop has been **deprecated** and is no longer maintained or supported.  
> Users are encouraged to use the [MeadTools Web App](https://meadtools.vercel.app) for the latest features and updates.  
> This repository remains public for historical reference.

---

## Overview

MeadTools Desktop was the standalone desktop version of **MeadTools**, an all-in-one calculator designed for meadmakers.  
Built using **Tauri 2.0**, it provided offline capabilities and a lightweight, native experience for managing and analyzing mead recipes.

---

## Legacy Features

- **Sortable Yeast Table** – Filter and sort yeast by nitrogen content, alcohol tolerance, and temperature range.  
- **Temperature Unit Conversion** – Switch between Fahrenheit and Celsius for temperature-dependent calculations.  
- **Offline Capability** – Fully functional without an internet connection.  
- **Lightweight Design** – Built with Tauri for minimal resource usage, suitable for low-spec machines.

---

## Deprecation Details

- **Last Release:** `v1.0.3`  
- **Support Status:** No longer maintained  
- **Reason:** MeadTools has transitioned fully to a modern web-based platform that receives all new features, bug fixes, and integrations.

You can continue to use previously downloaded versions of MeadTools Desktop, but **no further updates or security patches will be released**.

---

## Web Version

The MeadTools web version offers continuous updates, new brewing tools, and cloud-backed data access.  
👉 Visit [https://meadtools.vercel.app](https://meadtools.vercel.app)

---

## Legacy Development Instructions

> 🧩 _For archival or educational purposes only._  
> The setup instructions below are provided to allow developers to explore the historical desktop implementation.

### Prerequisites
- Node.js ≥ 16  
- Rust and Cargo  

### Setup
```bash
git clone https://github.com/ljreaux/meadtools-desktop.git
cd meadtools-desktop
npm install
npm run tauri dev
```

## Build for Production
To create a production build:
```bash
npm run tauri build
```
This will generate the executable for your platform.

## Contributing

This repository is no longer under active development.
Pull requests will not be reviewed, but forks are welcome for educational or experimental purposes.

## Support the Project

If you’d like to support continued MeadTools development (web and API), you can do so on [Ko-fi](https://ko-fi.com/meadtools).

## License
This project is licensed under the MIT License.
