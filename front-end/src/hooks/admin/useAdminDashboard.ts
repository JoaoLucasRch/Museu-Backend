import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  UserService,
  type RegisterAdminData,
} from "@/services/users/userService";

import { DashboardService } from "@/services/dashboard/dashboardService";

import type { UserProfile } from "@/types/User";

import type {
  DashboardActivityData,
  DashboardCardsData,
  DashboardChartsData,
  DashboardHistoryItem,
  UpcomingEventItem,
} from "@/types/Dashboard";


export default function useAdminDashboard() {

  const navigate = useNavigate();


  const [user, setUser] =
    useState<UserProfile | null>(null);



  const [cards, setCards] =
    useState<DashboardCardsData>({
      totalEventos:0,
      totalObras:0,
      editaisAtivos:0,
      obrasPendentes:0,
    });



  const [charts, setCharts] =
    useState<DashboardChartsData>({
      obrasPorStatus:[],
    });



  const [activity, setActivity] =
    useState<DashboardActivityData>({
      submissoesPorMes:[],

      eventosMaisAtivos:[],

      resumo30Dias:{
        obrasEnviadas:0,
        aprovadas:0,
        rejeitadas:0,
        expostas:0,
        eventosCriados:0,
      },
    });



  const [history, setHistory] =
    useState<DashboardHistoryItem[]>([]);



  const [upcomingEvents, setUpcomingEvents] =
    useState<UpcomingEventItem[]>([]);



  const [isLoading, setIsLoading] =
    useState(true);



  const [showNewAdminModal, setShowNewAdminModal] =
    useState(false);



  const [isRegistering, setIsRegistering] =
    useState(false);




  const fetchUserData =
    useCallback(async()=>{

      try{

        const profile =
          await UserService.getProfile();


        setUser(profile);

      }catch(error){

        console.error(
          "Erro ao carregar usuário:",
          error
        );

      }

    },[]);





  const fetchDashboard =
    useCallback(async()=>{

      try{

        const dashboard =
          await DashboardService.getDashboard();


        setCards(
          dashboard.cards
        );


        setCharts(
          dashboard.charts
        );


        setActivity(
          dashboard.activity
        );


        setHistory(
          dashboard.history
        );


        setUpcomingEvents(
          dashboard.upcomingEvents
        );


      }catch(error){

        console.error(
          "Erro ao carregar dashboard:",
          error
        );

      }

    },[]);






  const initialize =
    useCallback(async()=>{

      setIsLoading(true);


      try{

        await Promise.all([

          fetchUserData(),

          fetchDashboard(),

        ]);


      }finally{

        setIsLoading(false);

      }


    },[
      fetchUserData,
      fetchDashboard,
    ]);







  const validateAccess =
    useCallback(()=>{

      const token =
        localStorage.getItem(
          "token"
        );


      const role =
        localStorage.getItem(
          "userRole"
        );



      if(!token){

        navigate("/login");

        return false;

      }



      if(role !== "ADMIN"){

        navigate("/dashboard");

        return false;

      }



      return true;


    },[navigate]);







  useEffect(()=>{


    if(
      validateAccess()
    ){

      initialize();

    }


  },[
    validateAccess,
    initialize,
  ]);








  /**
   * Atualiza dashboard
   * quando retorna para a aba
   */
  useEffect(()=>{


    const handleVisibility =
      () => {

        if(
          document.visibilityState === "visible"
        ){

          fetchDashboard();

        }

      };



    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );



    return ()=>{

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

    };


  },[
    fetchDashboard,
  ]);







  function openRegisterModal(){

    setShowNewAdminModal(true);

  }



  function closeRegisterModal(){

    setShowNewAdminModal(false);

  }





  function updateUser(
    updated:UserProfile
  ){

    setUser(updated);

  }






  function openEvents(){

    navigate(
      "/admin/eventos"
    );

  }





  function openPendingArtworks(){

    navigate(
      "/admin/obras?status=pendente"
    );

  }









  async function handleRegisterAdmin(
    formData:RegisterAdminData
  ){

    setIsRegistering(true);


    try{


      const admin =
        await UserService.registerAdmin(
          formData
        );



      alert(
        `Administrador ${admin.nome} cadastrado com sucesso!`
      );



      closeRegisterModal();



      await Promise.all([

        fetchUserData(),

        fetchDashboard(),

      ]);



    }catch(error:any){


      alert(

        error?.response?.data?.message ||

        error.message ||

        "Erro ao cadastrar administrador."

      );



    }finally{


      setIsRegistering(false);


    }

  }







  return {

    user,


    cards,

    charts,

    activity,

    history,

    upcomingEvents,



    isLoading,

    isRegistering,


    showNewAdminModal,



    openRegisterModal,

    closeRegisterModal,



    openEvents,

    openPendingArtworks,



    updateUser,



    fetchUserData,

    fetchDashboard,



    handleRegisterAdmin,

  };

}