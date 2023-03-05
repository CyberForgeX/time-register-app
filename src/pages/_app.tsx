import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import CalendarIntegration from '../components/CalendarIntegration/CalendarIntegration';
import TimeEntryList from '../components/TimeEntryList/TimeEntryList';

function MyApp({ Component, pageProps }: AppProps) {
  const [isTimeEntryListLoaded, setIsTimeEntryListLoaded] = useState(false);

  useEffect(() => {
    setIsTimeEntryListLoaded(true);
  }, []);

  return (
    <>
      <header>
        <TimeEntryList onLoad={() => setIsTimeEntryListLoaded(true)} />
        <CalendarIntegration isTimeEntryListLoaded={isTimeEntryListLoaded} />
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer className="bg-primary-dark text-secondary-light py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Time Register App</h3>
          </div>
          <div className="flex items-center">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  FAQ
                </a>
              </li>
            </ul>
            <div className="ml-6">
              <p>&copy; 2023 Time Register App. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default MyApp;
