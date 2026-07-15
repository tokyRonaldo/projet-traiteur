"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";


export default function AcceptQuote({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = use(params);

    const router = useRouter();


    const [status, setStatus] = useState<
        "loading" | "success" | "error"
    >("loading");

    const [message, setMessage] = useState(
        "Traitement de votre demande..."
    );


    useEffect(() => {

        const token = localStorage.getItem("token");


        if (!token) {

            router.push(
                `/login?redirect=/client/quote/${id}/accept`
            );

            return;
        }


        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/client/quotes/${id}/accept`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
        .then(async(res)=>{

            if(res.status === 401){

                localStorage.removeItem("token");

                router.push(
                    `/login?redirect=/client/quote/${id}/accept`
                );

                return;
            }


            const data = await res.json();


            if(res.ok){

                setStatus("success");

                setMessage(
                    data.message ||
                    "Votre devis a été accepté avec succès."
                );


                setTimeout(()=>{
                    router.push("/client/dashboard");
                },3000);


            }else{

                setStatus("error");

                setMessage(
                    data.message ||
                    "Impossible d'accepter ce devis."
                );
            }

        })
        .catch(()=>{

            setStatus("error");

            setMessage(
                "Une erreur est survenue."
            );

        });


    }, [id, router]);



    return (
        <div className="min-h-screen flex items-center justify-center">

            <div className="text-center">

                {status === "loading" && (
                    <h1 className="text-xl">
                        ⏳ {message}
                    </h1>
                )}


                {status === "success" && (
                    <>
                        <div className="text-green-600 text-5xl">
                            ✓
                        </div>

                        <h1 className="text-2xl font-bold text-green-600">
                            Succès !
                        </h1>

                        <p>{message}</p>

                        <p className="text-gray-500 mt-2">
                            Redirection...
                        </p>
                    </>
                )}


                {status === "error" && (
                    <>
                        <div className="text-red-600 text-5xl">
                            ✕
                        </div>

                        <h1 className="text-2xl font-bold text-red-600">
                            Erreur
                        </h1>

                        <p>{message}</p>
                    </>
                )}

            </div>

        </div>
    );
}