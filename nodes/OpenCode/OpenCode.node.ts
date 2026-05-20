import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class OpenCode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenCode',
		name: 'openCode',
		icon: 'file:opencode.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with OpenCode AI models',
		defaults: {
			name: 'OpenCode',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'openCodeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Chat',
						value: 'chat',
					},
				],
				default: 'chat',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['chat'],
					},
				},
				options: [
					{
						name: 'Create Completion',
						value: 'createCompletion',
						description: 'Create a chat completion',
						routing: {
							request: {
								method: 'POST',
								url: '/chat/completions',
							},
						},
						action: 'Create a completion',
					},
				],
				default: 'createCompletion',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['createCompletion'],
					},
				},
				default: 'opencode-default-model',
				description: 'The model to use for completion',
				required: true,
				routing: {
					send: {
						type: 'body',
						property: 'model',
					},
				},
			},
			{
				displayName: 'Messages',
				name: 'messages',
				placeholder: 'Add Message',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['createCompletion'],
					},
				},
				description: 'The messages to send to the model',
				default: {},
				options: [
					{
						name: 'messageValues',
						displayName: 'Message',
						values: [
							{
								displayName: 'Role',
								name: 'role',
								type: 'options',
								options: [
									{
										name: 'System',
										value: 'system',
									},
									{
										name: 'User',
										value: 'user',
									},
									{
										name: 'Assistant',
										value: 'assistant',
									},
								],
								default: 'user',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: {
									rows: 4,
								},
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'messages',
						value: '={{$value.messageValues}}',
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['createCompletion'],
					},
				},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.7,
						description: 'Controls randomness. Lower values make the model more deterministic.',
						routing: {
							send: {
								type: 'body',
								property: 'temperature',
							},
						},
					},
					{
						displayName: 'Max Tokens',
						name: 'max_tokens',
						type: 'number',
						default: 1024,
						description: 'The maximum number of tokens to generate',
						routing: {
							send: {
								type: 'body',
								property: 'max_tokens',
							},
						},
					},
				],
			},
		],
	};
}
