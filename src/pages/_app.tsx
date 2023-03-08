import TimeEntryList, { Props as TimeEntryListProps } from "../components/TimeEntryList";
import CalendarIntegration, { Props as CalendarIntegrationProps } from "../components/CalendarIntegration";

type AppProps = {
  Component: React.ComponentType;
  pageProps: TimeEntryListProps & CalendarIntegrationProps;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <CalendarIntegration {...pageProps} />
      </header>

      <main className="flex-grow">
        <TimeEntryList {...pageProps} />
      </main>

      <footer className="bg-primary-dark text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm">&copy; 2023 My Awesome App</p>
          <p className="text-sm">Powered by Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
