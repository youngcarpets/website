# Hardware Specs — Future Local-LLM Rig

> **NOT the current dev machine.** This is a separate box the user will run Ollama / local models on. The current AY3 dev machine (where Claude Code + Zed run) is a different Windows box (Windows 10 Pro). Do not confuse the two.

## Machine: Dell Alienware Aurora R15 (LLM rig)

**Service Tag:** 3V708V3
**Purchased:** 2023-03-02 (ordered 2023-01-25) from Dell Canada

### Core Specs
- **CPU:** Intel Core i9-13900KF (13th gen, 24-core, 68MB cache, 3.0–5.8 GHz, Thermal Velocity Boost)
- **GPU:** NVIDIA GeForce RTX 3090, **24GB GDDR6X**
- **RAM:** 64GB DDR5 (2×32GB) @ 5200 MHz XMP
- **Storage:** 2TB M.2 PCIe NVMe SSD
- **PSU:** 750W
- **Cooling:** Alienware Cryo-tech liquid CPU cooling
- **Network:** Intel Killer Wi-Fi 6E AX 1675, Bluetooth 5.2
- **OS:** Windows 11 Home

### Price (CAD)
- Subtotal: $5,459.99
- Tax (HST 13%): $709.80
- **Total: $6,169.79 CAD**
- Accidental Damage Service (1yr): $79.00 (included above)
- Warranty: Premium Support + Onsite, 1 Year

## Ollama Capacity Notes (24GB VRAM)

With 24GB VRAM on the RTX 3090, realistic local model ceilings:
- **Up to ~13B params:** full precision (FP16), fast
- **Up to ~34B params:** Q4/Q5 quantized, comfortable fit
- **Up to ~70B params:** Q4 quantized, tight fit (may spill to system RAM → slower)
- **Context window:** large contexts eat VRAM — drop quant or model size if OOM

Good model picks for this box:
- `llama3.1:8b`, `llama3.1:70b-q4` (tight)
- `qwen2.5-coder:32b` (coding)
- `deepseek-r1:32b` (reasoning)
- `mistral-small:24b`
