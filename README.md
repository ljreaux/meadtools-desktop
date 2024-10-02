# MeadTools Desktop

MeadTools Desktop is the standalone desktop version of MeadTools, an all-in-one calculator designed for meadmakers. Built using Tauri 2.0, this version provides offline capabilities and a sleek, native experience for managing and analyzing mead recipes.

## Features
- Sortable Yeast Table: Filter and sort yeast by key attributes like nitrogen content, alcohol tolerance, and temperature range.
- Temperature Unit Conversion: Easily switch between Fahrenheit and Celsius for all temperature-dependent calculations.
- Offline Capability: MeadTools Desktop works without an internet connection, making it perfect for remote brewing sessions.
- Low Resource Usage: Built with Tauri, this app has a minimal footprint, allowing it to run efficiently even on low-spec machines.

## Installation

## Prerequisites
- Node.js >= v16
- Rust and Cargo

## Setup
1. Clone the repository:
```bash
git clone https://github.com/ljreaux/meadtools-desktop.git
```
2. Navigate into the directory:
```bash
cd meadtools-desktop
```
3. Install dependencies:
```bash
npm install
```
4. Build and run the app:
```bash
npm run tauri dev
```

## Build for Production
To create a production build:
```bash
npm run tauri build
```
This will generate the executable for your platform.

## Contributing

Feel free to submit issues and pull requests. Contributions are welcome!

## Support the Project

If you find MeadTools useful, consider supporting development by donating on [Ko-fi](https://ko-fi.com/meadtools).

## License
This project is licensed under the MIT License.

Let me know if you’d like any adjustments!
