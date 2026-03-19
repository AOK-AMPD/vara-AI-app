import { proxySecRequest } from './_lib/secProxy.js';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const url = new URL(request.url);
  const upstream = url.searchParams.get('upstream');
  const baseUrl =
    upstream === 'data'
      ? 'https://data.sec.gov'
      : upstream === 'efts'
        ? 'https://efts.sec.gov'
        : 'https://www.sec.gov';

  return proxySecRequest(request, baseUrl);
}
