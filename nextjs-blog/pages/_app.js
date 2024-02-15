import AzureAppInsights from '../AzureAppInsights';

function MyApp({ Component, pageProps }) {
  return (
    <AzureAppInsights>
      <Component {...pageProps} />
    </AzureAppInsights>
  );
}

export default MyApp;
