import { Pipe, PipeTransform } from '@angular/core';
import { LOCALES, SupportedLang, LocaleKey } from '../locales';

@Pipe({
  name: 't',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  transform(key: LocaleKey, params?: Record<string, string>): string {
    const lang = (localStorage.getItem('lang') as SupportedLang) || 'ua';
    let text = LOCALES[key]?.[lang] ?? key;
    if (params) {
      Object.keys(params).forEach(k => {
        text = text.replace(`{{${k}}}`, params[k]);
      });
    }
    return text;
  }
}
