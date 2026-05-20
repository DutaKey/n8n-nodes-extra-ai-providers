import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OpenCodeApi implements ICredentialType {
	name = 'openCodeApi';
	displayName = 'OpenCode API';
	documentationUrl = 'https://opencode.example.com/docs'; // Placeholder
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.opencode.example.com/v1',
			description: 'The base URL for the OpenCode API. Leave default unless you are using a proxy or specific endpoint.',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/models', // Assuming a standard /models endpoint for testing
		},
	};
}
