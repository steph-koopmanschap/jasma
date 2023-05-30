import "../shared/styles/globals.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../app/layouts/BaseLayout";

function MyApp({ Component, pageProps }) {
    const [queryClient] = React.useState(() => new QueryClient());

    const paypalClientID =
        process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_PRODUCTION
            : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX;

    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <PayPalScriptProvider options={{ "client-id": paypalClientID }}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </PayPalScriptProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </RecoilRoot>
    );
}

export default MyApp;
