import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

// Sem @angular/router: a navegação do wizard é controlada por um signal de estado local
// (ver app.ts, WizardStep) — nunca houve rota nem RouterLink neste app. Ver
// docs/preparacao-implementacao/prompts/VERIFICACAO-PERF-ROUTER-2026-09-05.md.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
  ]
};
