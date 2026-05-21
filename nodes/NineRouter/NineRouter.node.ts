import {
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IRequestOptions,
} from 'n8n-workflow';
import { N8nLlmTracing } from '@n8n/ai-utilities';

export class NineRouter implements INodeType {
	description: INodeTypeDescription = {
		displayName: '9Router Chat Model',
		name: 'nineRouter',
		icon: {
			light: 'file:ninerouter.svg',
			dark: 'file:ninerouter-light.svg',
		},
		group: ['transform'],
		version: 1,
		description: '9Router LangChain Chat Model — Smart AI Router with 60+ providers',
		defaults: {
			name: '9Router Chat Model',
		},
		codex: {
			categories: ['ai_languageModel'],
		},
		inputs: [],
		outputs: ['ai_languageModel'],
		credentials: [
			{
				name: 'nineRouterApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getModels',
				},
				default: '',
				description: 'The model to use for generation. Available models depend on your 9Router provider configuration.',
			},
			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				description: 'Additional options to configure the model',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Sampling Temperature',
						name: 'temperature',
						default: 0.7,
						typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
						description: 'Controls randomness. Lower values make the model more deterministic.',
						type: 'number',
					},
					{
						displayName: 'Maximum Number of Tokens',
						name: 'maxTokens',
						default: 1024,
						description: 'The maximum number of tokens to generate in the completion',
						type: 'number',
					},
					{
						displayName: 'Frequency Penalty',
						name: 'frequencyPenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description: "Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
						type: 'number',
					},
					{
						displayName: 'Presence Penalty',
						name: 'presencePenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description: "Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
						type: 'number',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						default: 1,
						typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
						description: 'Controls diversity via nucleus sampling. 0.5 means half of all likelihood-weighted options are considered.',
						type: 'number',
					},
					{
						displayName: 'Max Retries',
						name: 'maxRetries',
						default: 2,
						description: 'Maximum number of retries to attempt for API requests',
						type: 'number',
					},
					{
						displayName: 'Timeout (ms)',
						name: 'timeout',
						default: 60000,
						description: 'Maximum amount of time a request is allowed to take in milliseconds',
						type: 'number',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('nineRouterApi');
				const baseUrl = (credentials.baseUrl as string)?.replace(/\/$/, '') || 'http://localhost:20128/v1';

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/models`,
					json: true,
				};

				try {
					const response = await this.helpers.requestWithAuthentication.call(this, 'nineRouterApi', options);
					const models = response.data || [];
					return models.map((model: any) => ({
						name: model.id,
						value: model.id,
					}));
				} catch (error: any) {
					throw new Error(`Failed to load models from 9Router: ${error.message}`);
				}
			},
		},
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<any> {
		const credentials = await this.getCredentials('nineRouterApi');
		const baseUrl = (credentials.baseUrl as string)?.replace(/\/+$/, '') || 'http://localhost:20128/v1';
		const modelName = this.getNodeParameter('model', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as {
			temperature?: number;
			maxTokens?: number;
			frequencyPenalty?: number;
			presencePenalty?: number;
			topP?: number;
			maxRetries?: number;
			timeout?: number;
		};

		// Dynamically import ChatOpenAI (since 9Router uses OpenAI-compatible REST API)
		const { ChatOpenAI } = await import('@langchain/openai');

		const modelConfig: any = {
			apiKey: credentials.apiKey as string,
			configuration: {
				baseURL: baseUrl,
			},
			modelName: modelName,
			temperature: options.temperature ?? 0.7,
			maxTokens: options.maxTokens ?? 1024,
			maxRetries: options.maxRetries ?? 2,
			timeout: options.timeout ?? 60000,
			callbacks: [new N8nLlmTracing(this)],
		};

		if (options.frequencyPenalty !== undefined) {
			modelConfig.frequencyPenalty = options.frequencyPenalty;
		}
		if (options.presencePenalty !== undefined) {
			modelConfig.presencePenalty = options.presencePenalty;
		}
		if (options.topP !== undefined) {
			modelConfig.topP = options.topP;
		}

		const model = new ChatOpenAI(modelConfig);

		return {
			response: model,
		};
	}
}
