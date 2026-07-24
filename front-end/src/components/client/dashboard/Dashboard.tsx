"use client";

import {
    Calendar,
    MessageSquare,
    Heart,
    Plus,
    Clock,
    MapPin,
    User
} from "lucide-react";



const requests = [
    {
        id:1,
        title:"Mariage",
        date:"15 Août 2026",
        guests:150,
        status:"En attente"
    },
    {
        id:2,
        title:"Anniversaire",
        date:"20 Septembre 2026",
        guests:50,
        status:"Réponse reçue"
    }
];



const messages = [
    {
        id:1,
        name:"Maison Gourmande",
        message:"Votre devis a été envoyé.",
        time:"10 min"
    },
    {
        id:2,
        name:"Saveur Premium",
        message:"Nous avons une proposition.",
        time:"1h"
    }
];



const caterers = [
    {
        id:1,
        name:"Délice Traiteur",
        city:"Antananarivo",
        speciality:"Cuisine française"
    },
    {
        id:2,
        name:"Saveurs Malgaches",
        city:"Antananarivo",
        speciality:"Cuisine locale"
    }
];



export default function Dashboard(){


return (

<div className="space-y-6">


    {/* Welcome */}

    <section className="
        bg-white rounded-xl
        p-6 border
        flex justify-between items-center
    ">

        <div>

            <h1 className="text-2xl font-bold">
                Bonjour Toky 👋
            </h1>

            <p className="text-gray-500 mt-2">
                Retrouvez vos demandes, messages et réservations.
            </p>

        </div>


        <button
            className="
            flex items-center gap-2
            bg-blue-600 text-white
            px-4 py-3 rounded-lg
            "
        >
            <Plus size={18}/>
            Nouvelle demande
        </button>


    </section>





    {/* Grid principale */}

    <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
    ">



        {/* Demandes actives */}

        <div className="
            xl:col-span-2
            bg-white
            border
            rounded-xl
            p-5
        ">

            <div className="flex justify-between mb-5">

                <h2 className="font-semibold text-lg">
                    Demandes actives
                </h2>


                <span className="text-sm text-blue-600">
                    Voir tout
                </span>

            </div>



            <div className="space-y-4">

            {
                requests.map(request=>(

                    <div
                    key={request.id}
                    className="
                    border rounded-lg p-4
                    flex justify-between
                    "
                    >

                        <div>

                            <h3 className="font-medium">
                                {request.title}
                            </h3>


                            <div className="
                            text-sm text-gray-500
                            flex gap-4 mt-2
                            ">

                                <span className="flex gap-1">
                                    <Calendar size={15}/>
                                    {request.date}
                                </span>


                                <span className="flex gap-1">
                                    <User size={15}/>
                                    {request.guests}
                                </span>

                            </div>


                        </div>


                        <span className="
                        text-sm
                        bg-yellow-100
                        text-yellow-700
                        px-3 py-1
                        rounded-full
                        h-fit
                        ">
                            {request.status}
                        </span>


                    </div>

                ))
            }

            </div>


        </div>







        {/* Messages */}

        <div className="
        bg-white
        border
        rounded-xl
        p-5
        ">


            <h2 className="font-semibold text-lg mb-5">
                Messages
            </h2>



            <div className="space-y-4">


            {
                messages.map(message=>(

                    <div
                    key={message.id}
                    className="
                    flex gap-3
                    "
                    >

                        <div className="
                        bg-blue-100
                        p-2
                        rounded-full
                        ">

                            <MessageSquare size={18}/>

                        </div>



                        <div>

                            <p className="font-medium">
                                {message.name}
                            </p>


                            <p className="
                            text-sm text-gray-500
                            ">
                                {message.message}
                            </p>


                            <span className="
                            text-xs text-gray-400
                            ">
                                {message.time}
                            </span>


                        </div>


                    </div>


                ))
            }


            </div>


        </div>



    </div>






    {/* Prochaine réservation */}

    <section className="
    bg-white
    border
    rounded-xl
    p-5
    ">


        <h2 className="font-semibold text-lg mb-4">
            Prochaine réservation
        </h2>


        <div className="
        flex items-center gap-4
        ">


            <Calendar size={30}/>


            <div>

                <p className="font-medium">
                    Mariage de famille
                </p>


                <p className="
                text-sm text-gray-500
                ">
                    15 Août 2026 - 150 invités
                </p>

            </div>


        </div>


    </section>








    {/* Favoris */}

    <section>


        <h2 className="
        font-semibold
        text-lg
        mb-4
        flex gap-2
        items-center
        ">

            <Heart size={20}/>
            Traiteurs favoris

        </h2>




        <div className="
        grid
        md:grid-cols-2
        gap-5
        ">


        {
            caterers.map(caterer=>(


                <div
                key={caterer.id}
                className="
                bg-white
                border
                rounded-xl
                p-5
                "
                >


                    <h3 className="font-semibold">
                        {caterer.name}
                    </h3>


                    <p className="
                    text-sm text-gray-500
                    flex gap-2 mt-2
                    ">

                        <MapPin size={15}/>

                        {caterer.city}

                    </p>


                    <p className="
                    text-sm mt-2
                    ">
                        {caterer.speciality}
                    </p>


                </div>


            ))
        }


        </div>


    </section>





</div>


);


}