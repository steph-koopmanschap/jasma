import "../styles/globals.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import Layout from "../components/Layout";
import "react-toastify/dist/ReactToastify.css";
function MyApp({ Component, pageProps }) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </RecoilRoot>
    );
}

export default MyApp;
