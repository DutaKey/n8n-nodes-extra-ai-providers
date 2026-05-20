import {
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IRequestOptions,
} from 'n8n-workflow';

export class OpenCode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenCode Chat Model',
		name: 'openCode',
		icon: 'file:opencode.svg',
		group: ['transform'],
		version: 1,
		description: 'OpenCode LangChain Chat Model for Advanced AI Agents',
		defaults: {
			name: 'OpenCode Chat Model',
		},
		// This defines it as a sub-node for LangChain/Advanced AI nodes
		codex: {
			categories: ['ai_languageModel'],
		},
		inputs: [],
		outputs: ['ai_languageModel'],
		credentials: [
			{
				name: 'openCodeApi',
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
				description: 'The model to use for generation (e.g. gpt-4o, or specific OpenCode model ID)',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				default: 0.7,
				description: 'Controls randomness. Lower values make the model more deterministic.',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 1024,
				description: 'The maximum number of tokens to generate',
			},
		],
	};

	methods = {
		loadOptions: {
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('openCodeApi');
				const baseUrl = (credentials.baseUrl as string)?.replace(/\/$/, '') || 'https://opencode.ai/zen/go/v1';

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/models`,
					json: true,
				};

				try {
					const response = await this.helpers.requestWithAuthentication.call(this, 'openCodeApi', options);
					const models = response.data || [];
					return models.map((model: any) => ({
						name: model.id,
						value: model.id,
					}));
				} catch (error: any) {
					throw new Error(`Failed to load models: ${error.message}`);
				}
			},
		},
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<any> {
		const credentials = await this.getCredentials('openCodeApi');
		const modelName = this.getNodeParameter('model', itemIndex) as string;
		const temperature = this.getNodeParameter('temperature', itemIndex) as number;
		const maxTokens = this.getNodeParameter('maxTokens', itemIndex) as number;

		// Dynamically import ChatOpenAI (since OpenCode uses OpenAI-compatible REST API)
		// This prevents heavy initialization at startup
		const { ChatOpenAI } = await import('@langchain/openai');

		return new ChatOpenAI({
			openAIApiKey: credentials.apiKey as string,
			configuration: {
				baseURL: credentials.baseUrl as string,
			},
			modelName: modelName,
			temperature: temperature,
			maxTokens: maxTokens,
		});
	}
}
