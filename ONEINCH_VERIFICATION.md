# 1inch Limit Order Protocol - Verification Tools

This directory contains utility scripts to verify that your DEX is using the 1inch Limit Order Protocol for on-chain settlement.

## 📋 Available Tools

### 1. **verify-transaction.js**
Verifies a specific transaction to confirm it's using the 1inch protocol.

**Usage:**
```bash
node verify-transaction.js <TRANSACTION_HASH>
```

**Example:**
```bash
node verify-transaction.js 0x98f9c178c69a2fa9fa1ed38eacc8257f8414d301854355f17679c64bf456996a
```

**What it shows:**
- ✅ Transaction details (from, to, gas, block)
- ✅ Confirms it's calling the 1inch contract
- ✅ Decodes the `fillOrder` function call
- ✅ Shows order details (maker, assets, amounts)
- ✅ Transaction status (success/failed)
- ✅ Direct link to blockchain explorer

---

### 2. **monitor-oneinch-events.js**
Monitors the 1inch contract for recent OrderFilled and OrderCanceled events.

**Usage:**
```bash
node monitor-oneinch-events.js
```

**What it shows:**
- 📊 Recent `OrderFilled` events (last 100 blocks)
- 📊 Recent `OrderCanceled` events (last 100 blocks)
- 📍 Event details (order hash, block, transaction hash)
- 🔗 Direct links to blockchain explorer

---

## 🎯 When to Use These Tools

### **After Creating Orders:**
Use `monitor-oneinch-events.js` to see if your orders are being filled on-chain.

### **After Getting a Transaction Hash:**
Use `verify-transaction.js <TX_HASH>` to get detailed information about the settlement.

### **For Debugging:**
If orders aren't settling, check:
1. Are there any `OrderFilled` events? (monitor script)
2. Did the transaction succeed? (verify script)
3. Check the blockchain explorer link provided

---

## 🔗 Contract Information

**1inch Limit Order Protocol Contract:**
- Address: `0xB5538A77399b009dC036fe7FfD94798B5b3D6962`
- Chain: Monad Testnet (10143)
- Explorer: https://testnet.monad.xyz/address/0xB5538A77399b009dC036fe7FfD94798B5b3D6962

---

## 📚 Example Output

### verify-transaction.js
```
✅ CONFIRMED: This transaction calls the 1inch Limit Order Contract!
📞 Function Called: fillOrder
✅ CONFIRMED: This is a fillOrder call (1inch limit order execution)!

Order Details:
──────────────────────────────────────────────────────────────────────
Maker:         0xb6469c34977ca3fb9e46453A56066995f38320ea
Maker Asset:   0x9f19b6B8cB0378592C6173F9FC794401274DBb6a (MUSDC)
Taker Asset:   0x3CDF19aD4e2656269aAE1b8AC8E932D66cDd0443 (MUSDT)
Making Amount: 22000000
Taking Amount: 22000000
Fill Amount:   3000000
──────────────────────────────────────────────────────────────────────

Status: ✅ SUCCESS
```

### monitor-oneinch-events.js
```
✅ Found 1 OrderFilled event(s):

📍 Order Filled:
   Order Hash: 0xfae753ff92a052f522fd7b809ac1ad07ca4095fd223ce37b02f215b7b93a5e60
   Remaining: 0
   Block: 46971786
   TX: 0x98f9c178c69a2fa9fa1ed38eacc8257f8414d301854355f17679c64bf456996a
   Explorer: https://testnet.monad.xyz/tx/0x98f9...
```

---

## 💡 Tips

1. **Run monitor periodically** to see new fills in real-time
2. **Save transaction hashes** from your frontend logs for later verification
3. **Check the explorer** for visual confirmation of on-chain activity
4. **Use these tools for debugging** if orders aren't settling as expected

---

## ✅ Success Indicators

Your DEX is correctly using 1inch if you see:
- ✅ Transactions calling `fillOrder` on the 1inch contract
- ✅ `OrderFilled` events being emitted
- ✅ Transaction status: SUCCESS
- ✅ Correct maker/taker addresses and amounts

---

**Last verified transaction:**
`0x98f9c178c69a2fa9fa1ed38eacc8257f8414d301854355f17679c64bf456996a`

🎉 **Your DEX is successfully using 1inch Limit Order Protocol V4!**
