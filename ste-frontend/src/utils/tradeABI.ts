// 1inch Limit Order Protocol V4 ABI
export const ONEINCH_LIMIT_ORDER_PROTOCOL_ABI = [
  // Order structure - 1inch V4 uses Address (uint256) and MakerTraits (uint256)
  {
    type: 'function',
    name: 'fillOrder',
    inputs: [
      {
        name: 'order',
        type: 'tuple',
        components: [
          { name: 'salt', type: 'uint256' },
          { name: 'maker', type: 'uint256' },          // Address type in Solidity is uint256
          { name: 'receiver', type: 'uint256' },       // Address type in Solidity is uint256
          { name: 'makerAsset', type: 'uint256' },     // Address type in Solidity is uint256
          { name: 'takerAsset', type: 'uint256' },     // Address type in Solidity is uint256
          { name: 'makingAmount', type: 'uint256' },
          { name: 'takingAmount', type: 'uint256' },
          { name: 'makerTraits', type: 'uint256' },    // MakerTraits type in Solidity is uint256
        ],
      },
      { name: 'r', type: 'bytes32' },
      { name: 'vs', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
      { name: 'takerTraits', type: 'uint256' },
    ],
    outputs: [
      { name: 'makingAmount', type: 'uint256' },
      { name: 'takingAmount', type: 'uint256' },
      { name: 'orderHash', type: 'bytes32' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'cancelOrder',
    inputs: [
      { name: 'makerTraits', type: 'uint256' },
      { name: 'orderHash', type: 'bytes32' },
    ],
    outputs: [
      { name: 'orderRemaining', type: 'uint256' },
      { name: 'orderHash', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'remaining',
    inputs: [{ name: 'orderHash', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'remainingInvalidatorForOrder',
    inputs: [
      { name: 'maker', type: 'address' },
      { name: 'slot', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DOMAIN_SEPARATOR',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'OrderFilled',
    inputs: [
      { name: 'orderHash', type: 'bytes32', indexed: true },
      { name: 'remainingAmount', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderCanceled',
    inputs: [
      { name: 'orderHash', type: 'bytes32', indexed: true },
      { name: 'remainingAmount', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
] as const;

// ERC20 Token ABI (for approvals)
export const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const;

export const ENTRY_POINT_ABI = [
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: 'ret',
        type: 'bytes',
      },
    ],
    name: 'DelegateAndRevert',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'opIndex',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'FailedOp',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'opIndex',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'inner',
        type: 'bytes',
      },
    ],
    name: 'FailedOpWithRevert',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'returnData',
        type: 'bytes',
      },
    ],
    name: 'PostOpReverted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'SenderAddressResult',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'aggregator',
        type: 'address',
      },
    ],
    name: 'SignatureValidationFailed',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'userOpHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'paymaster',
        type: 'address',
      },
    ],
    name: 'AccountDeployed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'BeforeExecution',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalDeposit',
        type: 'uint256',
      },
    ],
    name: 'Deposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'userOpHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'revertReason',
        type: 'bytes',
      },
    ],
    name: 'PostOpRevertReason',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'aggregator',
        type: 'address',
      },
    ],
    name: 'SignatureAggregatorChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalStaked',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unstakeDelaySec',
        type: 'uint256',
      },
    ],
    name: 'StakeLocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawTime',
        type: 'uint256',
      },
    ],
    name: 'StakeUnlocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'withdrawAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'StakeWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'userOpHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'paymaster',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'actualGasCost',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'actualGasUsed',
        type: 'uint256',
      },
    ],
    name: 'UserOperationEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'userOpHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    name: 'UserOperationPrefundTooLow',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'userOpHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'revertReason',
        type: 'bytes',
      },
    ],
    name: 'UserOperationRevertReason',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'withdrawAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'unstakeDelaySec',
        type: 'uint32',
      },
    ],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'delegateAndRevert',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'depositTo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'deposits',
    outputs: [
      {
        internalType: 'uint256',
        name: 'deposit',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'staked',
        type: 'bool',
      },
      {
        internalType: 'uint112',
        name: 'stake',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: 'unstakeDelaySec',
        type: 'uint32',
      },
      {
        internalType: 'uint48',
        name: 'withdrawTime',
        type: 'uint48',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getDepositInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'staked',
            type: 'bool',
          },
          {
            internalType: 'uint112',
            name: 'stake',
            type: 'uint112',
          },
          {
            internalType: 'uint32',
            name: 'unstakeDelaySec',
            type: 'uint32',
          },
          {
            internalType: 'uint48',
            name: 'withdrawTime',
            type: 'uint48',
          },
        ],
        internalType: 'struct IStakeManager.DepositInfo',
        name: 'info',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint192',
        name: 'key',
        type: 'uint192',
      },
    ],
    name: 'getNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'initCode',
        type: 'bytes',
      },
    ],
    name: 'getSenderAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'initCode',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'callData',
            type: 'bytes',
          },
          {
            internalType: 'bytes32',
            name: 'accountGasLimits',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'preVerificationGas',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'gasFees',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'paymasterAndData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct PackedUserOperation',
        name: 'userOp',
        type: 'tuple',
      },
    ],
    name: 'getUserOpHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'sender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'bytes',
                name: 'initCode',
                type: 'bytes',
              },
              {
                internalType: 'bytes',
                name: 'callData',
                type: 'bytes',
              },
              {
                internalType: 'bytes32',
                name: 'accountGasLimits',
                type: 'bytes32',
              },
              {
                internalType: 'uint256',
                name: 'preVerificationGas',
                type: 'uint256',
              },
              {
                internalType: 'bytes32',
                name: 'gasFees',
                type: 'bytes32',
              },
              {
                internalType: 'bytes',
                name: 'paymasterAndData',
                type: 'bytes',
              },
              {
                internalType: 'bytes',
                name: 'signature',
                type: 'bytes',
              },
            ],
            internalType: 'struct PackedUserOperation[]',
            name: 'userOps',
            type: 'tuple[]',
          },
          {
            internalType: 'contract IAggregator',
            name: 'aggregator',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct IEntryPoint.UserOpsPerAggregator[]',
        name: 'opsPerAggregator',
        type: 'tuple[]',
      },
      {
        internalType: 'address payable',
        name: 'beneficiary',
        type: 'address',
      },
    ],
    name: 'handleAggregatedOps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'initCode',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'callData',
            type: 'bytes',
          },
          {
            internalType: 'bytes32',
            name: 'accountGasLimits',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'preVerificationGas',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'gasFees',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'paymasterAndData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct PackedUserOperation[]',
        name: 'ops',
        type: 'tuple[]',
      },
      {
        internalType: 'address payable',
        name: 'beneficiary',
        type: 'address',
      },
    ],
    name: 'handleOps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint192',
        name: 'key',
        type: 'uint192',
      },
    ],
    name: 'incrementNonce',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'callData',
        type: 'bytes',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'sender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'verificationGasLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'callGasLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'paymasterVerificationGasLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'paymasterPostOpGasLimit',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'preVerificationGas',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'paymaster',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxFeePerGas',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxPriorityFeePerGas',
                type: 'uint256',
              },
            ],
            internalType: 'struct EntryPoint.MemoryUserOp',
            name: 'mUserOp',
            type: 'tuple',
          },
          {
            internalType: 'bytes32',
            name: 'userOpHash',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'prefund',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'contextOffset',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'preOpGas',
            type: 'uint256',
          },
        ],
        internalType: 'struct EntryPoint.UserOpInfo',
        name: 'opInfo',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'context',
        type: 'bytes',
      },
    ],
    name: 'innerHandleOp',
    outputs: [
      {
        internalType: 'uint256',
        name: 'actualGasCost',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint192',
        name: '',
        type: 'uint192',
      },
    ],
    name: 'nonceSequenceNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'withdrawAddress',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'withdrawAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'withdrawAmount',
        type: 'uint256',
      },
    ],
    name: 'withdrawTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];

export const ZERO_X_NATIVE_ORDER_FEATURE_ABI: any = [
  {
    inputs: [
      { internalType: 'address', name: 'zeroExAddress', type: 'address' },
      {
        internalType: 'contract IEtherTokenV06',
        name: 'weth',
        type: 'address',
      },
      { internalType: 'contract IStaking', name: 'staking', type: 'address' },
      {
        internalType: 'contract FeeCollectorController',
        name: 'feeCollectorController',
        type: 'address',
      },
      { internalType: 'uint32', name: 'protocolFeeMultiplier', type: 'uint32' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'taker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'feeRecipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'makerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'takerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'takerTokenFilledAmount',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'takerTokenFeeFilledAmount',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'protocolFeePaid',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'pool',
        type: 'bytes32',
      },
    ],
    name: 'LimitOrderFilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
    ],
    name: 'OrderCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'signer',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'allowed', type: 'bool' },
    ],
    name: 'OrderSignerRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'makerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'takerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minValidSalt',
        type: 'uint256',
      },
    ],
    name: 'PairCancelledLimitOrders',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'makerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'takerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minValidSalt',
        type: 'uint256',
      },
    ],
    name: 'PairCancelledRfqOrders',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'taker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'makerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'takerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'takerTokenFilledAmount',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'pool',
        type: 'bytes32',
      },
    ],
    name: 'RfqOrderFilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'origin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'addrs',
        type: 'address[]',
      },
      { indexed: false, internalType: 'bool', name: 'allowed', type: 'bool' },
    ],
    name: 'RfqOrderOriginsAllowed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'EIP712_DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FEATURE_NAME',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FEATURE_VERSION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PROTOCOL_FEE_MULTIPLIER',
    outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'takerTokenFillAmount',
        type: 'uint128',
      },
      { internalType: 'address', name: 'taker', type: 'address' },
      { internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: '_fillLimitOrder',
    outputs: [
      {
        internalType: 'uint128',
        name: 'takerTokenFilledAmount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'takerTokenFillAmount',
        type: 'uint128',
      },
      { internalType: 'address', name: 'taker', type: 'address' },
      { internalType: 'bool', name: 'useSelfBalance', type: 'bool' },
      { internalType: 'address', name: 'recipient', type: 'address' },
    ],
    name: '_fillRfqOrder',
    outputs: [
      {
        internalType: 'uint128',
        name: 'takerTokenFilledAmount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
    ],
    name: 'batchCancelLimitOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'makerTokens',
        type: 'address[]',
      },
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'takerTokens',
        type: 'address[]',
      },
      { internalType: 'uint256[]', name: 'minValidSalts', type: 'uint256[]' },
    ],
    name: 'batchCancelPairLimitOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'makerTokens',
        type: 'address[]',
      },
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'takerTokens',
        type: 'address[]',
      },
      { internalType: 'uint256[]', name: 'minValidSalts', type: 'uint256[]' },
    ],
    name: 'batchCancelPairLimitOrdersWithSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'makerTokens',
        type: 'address[]',
      },
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'takerTokens',
        type: 'address[]',
      },
      { internalType: 'uint256[]', name: 'minValidSalts', type: 'uint256[]' },
    ],
    name: 'batchCancelPairRfqOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'makerTokens',
        type: 'address[]',
      },
      {
        internalType: 'contract IERC20TokenV06[]',
        name: 'takerTokens',
        type: 'address[]',
      },
      { internalType: 'uint256[]', name: 'minValidSalts', type: 'uint256[]' },
    ],
    name: 'batchCancelPairRfqOrdersWithSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
    ],
    name: 'batchCancelRfqOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature[]',
        name: 'signatures',
        type: 'tuple[]',
      },
    ],
    name: 'batchGetLimitOrderRelevantStates',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
          {
            internalType: 'enum LibNativeOrder.OrderStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct LibNativeOrder.OrderInfo[]',
        name: 'orderInfos',
        type: 'tuple[]',
      },
      {
        internalType: 'uint128[]',
        name: 'actualFillableTakerTokenAmounts',
        type: 'uint128[]',
      },
      { internalType: 'bool[]', name: 'isSignatureValids', type: 'bool[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature[]',
        name: 'signatures',
        type: 'tuple[]',
      },
    ],
    name: 'batchGetRfqOrderRelevantStates',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
          {
            internalType: 'enum LibNativeOrder.OrderStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct LibNativeOrder.OrderInfo[]',
        name: 'orderInfos',
        type: 'tuple[]',
      },
      {
        internalType: 'uint128[]',
        name: 'actualFillableTakerTokenAmounts',
        type: 'uint128[]',
      },
      { internalType: 'bool[]', name: 'isSignatureValids', type: 'bool[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'cancelLimitOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20TokenV06',
        name: 'makerToken',
        type: 'address',
      },
      {
        internalType: 'contract IERC20TokenV06',
        name: 'takerToken',
        type: 'address',
      },
      { internalType: 'uint256', name: 'minValidSalt', type: 'uint256' },
    ],
    name: 'cancelPairLimitOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      {
        internalType: 'contract IERC20TokenV06',
        name: 'makerToken',
        type: 'address',
      },
      {
        internalType: 'contract IERC20TokenV06',
        name: 'takerToken',
        type: 'address',
      },
      { internalType: 'uint256', name: 'minValidSalt', type: 'uint256' },
    ],
    name: 'cancelPairLimitOrdersWithSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20TokenV06',
        name: 'makerToken',
        type: 'address',
      },
      {
        internalType: 'contract IERC20TokenV06',
        name: 'takerToken',
        type: 'address',
      },
      { internalType: 'uint256', name: 'minValidSalt', type: 'uint256' },
    ],
    name: 'cancelPairRfqOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      {
        internalType: 'contract IERC20TokenV06',
        name: 'makerToken',
        type: 'address',
      },
      {
        internalType: 'contract IERC20TokenV06',
        name: 'takerToken',
        type: 'address',
      },
      { internalType: 'uint256', name: 'minValidSalt', type: 'uint256' },
    ],
    name: 'cancelPairRfqOrdersWithSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'cancelRfqOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'takerTokenFillAmount',
        type: 'uint128',
      },
    ],
    name: 'fillLimitOrder',
    outputs: [
      {
        internalType: 'uint128',
        name: 'takerTokenFilledAmount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'takerTokenFillAmount',
        type: 'uint128',
      },
    ],
    name: 'fillOrKillLimitOrder',
    outputs: [
      {
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'takerTokenFillAmount',
        type: 'uint128',
      },
    ],
    name: 'fillOrKillRfqOrder',
    outputs: [
      {
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'takerTokenFillAmount',
        type: 'uint128',
      },
    ],
    name: 'fillRfqOrder',
    outputs: [
      {
        internalType: 'uint128',
        name: 'takerTokenFilledAmount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'makerTokenFilledAmount',
        type: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'getLimitOrderHash',
    outputs: [{ internalType: 'bytes32', name: 'orderHash', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'getLimitOrderInfo',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
          {
            internalType: 'enum LibNativeOrder.OrderStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct LibNativeOrder.OrderInfo',
        name: 'orderInfo',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'takerTokenFeeAmount',
            type: 'uint128',
          },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'feeRecipient', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.LimitOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
    ],
    name: 'getLimitOrderRelevantState',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
          {
            internalType: 'enum LibNativeOrder.OrderStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct LibNativeOrder.OrderInfo',
        name: 'orderInfo',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'actualFillableTakerTokenAmount',
        type: 'uint128',
      },
      { internalType: 'bool', name: 'isSignatureValid', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getProtocolFeeMultiplier',
    outputs: [{ internalType: 'uint32', name: 'multiplier', type: 'uint32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'getRfqOrderHash',
    outputs: [{ internalType: 'bytes32', name: 'orderHash', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'getRfqOrderInfo',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
          {
            internalType: 'enum LibNativeOrder.OrderStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct LibNativeOrder.OrderInfo',
        name: 'orderInfo',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20TokenV06',
            name: 'makerToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20TokenV06',
            name: 'takerToken',
            type: 'address',
          },
          { internalType: 'uint128', name: 'makerAmount', type: 'uint128' },
          { internalType: 'uint128', name: 'takerAmount', type: 'uint128' },
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'taker', type: 'address' },
          { internalType: 'address', name: 'txOrigin', type: 'address' },
          { internalType: 'bytes32', name: 'pool', type: 'bytes32' },
          { internalType: 'uint64', name: 'expiry', type: 'uint64' },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct LibNativeOrder.RfqOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'enum LibSignature.SignatureType',
            name: 'signatureType',
            type: 'uint8',
          },
          { internalType: 'uint8', name: 'v', type: 'uint8' },
          { internalType: 'bytes32', name: 'r', type: 'bytes32' },
          { internalType: 'bytes32', name: 's', type: 'bytes32' },
        ],
        internalType: 'struct LibSignature.Signature',
        name: 'signature',
        type: 'tuple',
      },
    ],
    name: 'getRfqOrderRelevantState',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
          {
            internalType: 'enum LibNativeOrder.OrderStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'takerTokenFilledAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct LibNativeOrder.OrderInfo',
        name: 'orderInfo',
        type: 'tuple',
      },
      {
        internalType: 'uint128',
        name: 'actualFillableTakerTokenAmount',
        type: 'uint128',
      },
      { internalType: 'bool', name: 'isSignatureValid', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      { internalType: 'address', name: 'signer', type: 'address' },
    ],
    name: 'isValidOrderSigner',
    outputs: [{ internalType: 'bool', name: 'isValid', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'migrate',
    outputs: [{ internalType: 'bytes4', name: 'success', type: 'bytes4' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'signer', type: 'address' },
      { internalType: 'bool', name: 'allowed', type: 'bool' },
    ],
    name: 'registerAllowedOrderSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'origins', type: 'address[]' },
      { internalType: 'bool', name: 'allowed', type: 'bool' },
    ],
    name: 'registerAllowedRfqOrigins',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32[]', name: 'poolIds', type: 'bytes32[]' }],
    name: 'transferProtocolFeesForPools',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
