export interface SocialAuthServiceConfig {
  APP_ID: string;
  APP_SECRET: string;
}

export interface SocialAuthServices {
  [name: string]: SocialAuthServiceConfig;
}

export interface SocialAuthModuleConfig {
  socialAuthServices: { [name: string]: SocialAuthServiceConfig };
}
