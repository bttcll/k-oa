/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

class STAT {
    constructor(index, media, devst) {
        this.index = index;
        this.media = media;
        this.devst = devst;
    }
}
class STUDENTE {

    // COSTRUTTORE DELLA CLASSE STUDENTE
    constructor(index, j, k, kt, jt, kTeacher, stato,
        dev, delta, backStudent, distanza, pointer, precpointer) {

        // DATI CHE COMPONGONO IL MODELLO STUDENTE
        this.index = index; // indice dello studente nella lista classe
        this.j = j; // bravura dello studente nel valutare i pari
        this.k = k; // valutazione attuale dello studente
        this.kt = kt; // voto reale che assegnerebbe il docente
        this.jt = jt; // capacità reale che apparterrebbe allo studente
        this.kTeacher = kTeacher; // voto assegnato ufficilamente dal docente
        this.stato = stato; // stato CORE O NOCORE dello studente (valutato o meno)
        this.dev = dev; // deviazione standard dello studente, affidabilità del voto

        this.delta = delta; // distanza tra la valutazione attuale dello studente e il voto del docente
        this.backStudent; // condizione di aggiornamento del nodo collegato allo studente valutato

        this.distanza = distanza || []; // distanza ordinata da tutti i core
        this.pointer = pointer || []; // puntatori ai K core i
        this.precpointer = precpointer || []; // puntatore al nodo precedente
    }
}
class STUDENTECORE {
    constructor(QuantiCore, IndexCore) {
        this.QuantiCore = QuantiCore;

        //int IndexCore[MAX_STUDENTI];
        this.IndexCore = IndexCore || [];
    }
}

export default new Vuex.Store({
    state: {
        STAT: STAT,
        statisticsStudents: [],

        KMIN: 1,
        KMAX: 10,

        alfakT: 0.1,

        nCalcoli: 0,
        NumeroCore: 0,
        NumeroDistanze: 0,

        Grafo: [],
        TeacherGrades: [],
        cont: [],

        iterazioni: 0,
        DEBUG: "OFF",

        STUDENTE: STUDENTE,
        classe: [],

        STUDENTECORE: STUDENTECORE,
        Core: {},

        distanzaMediaStudenti: [],

        // memorizza lo storico delle distanze medie
        distanzaMedia: [],

        n_iterazioni: 0,

        NUMSTUDENTI: 0,
        NUMSTUDENTIVOTATI: 0,

        FrequenzeK: [],
        nRealGrades: 0, // numero di copie reali->simulato

        //extra per la dashboard
        builded: 0,
        kDone: 0,

        // contatore sessioni
        nSessione: 0
    },
    mutations: {
        saveAll(state) {
            const FileSaver = require('file-saver');

            //salvo il file in locale
            const blob = new Blob([JSON.stringify(state)], {
                type: "text/plain;charset=utf-8"
            });
            const d = new Date();
            FileSaver.saveAs(blob, "session_" + d.getDate() + "_" + d.getMonth() + "_" + d.getFullYear() + ".txt");

        },
        loadAll(state, file) {
            const data = JSON.parse(file);

            state.statisticsStudents = data.statisticsStudents;
            state.alfakT = data.alfakT;
            state.KMIN = data.KMIN;
            state.KMAX = data.KMAX;
            state.nCalcoli = data.nCalcoli;
            state.NumeroCore = data.NumeroCore;
            state.NumeroDistanze = data.NumeroDistanze;
            state.Grafo = data.Grafo;
            state.TeacherGrades = data.TeacherGrades;
            state.cont = data.cont;
            state.iterazioni = data.iterazioni;
            state.DEBUG = data.DEBUG;
            state.classe = data.classe;
            state.Core = data.Core;
            state.distanzaMediaStudenti = data.distanzaMediaStudenti;
            state.distanzaMedia = data.distanzaMedia;
            state.n_iterazioni = data.n_iterazioni;
            state.NUMSTUDENTI = data.NUMSTUDENTI;
            state.NUMSTUDENTIVOTATI = data.NUMSTUDENTIVOTATI;
            state.FrequenzeK = data.FrequenzeK;
            state.nRealGrades = data.nRealGrades;
            state.builded = data.builded;
            state.kDone = data.kDone;
            state.nSessione = data.nSessione;
        },
        resetAll(state) {
            localStorage.clear();
            state.statisticsStudents = [];
            state.alfakT = 0.1;
            state.KMIN = 1;
            state.KMAX = 10;
            state.nCalcoli = 0;
            state.NumeroCore = 0;
            state.NumeroDistanze = 0;
            state.Grafo = [];
            state.TeacherGrades = [];
            state.cont = [];
            state.iterazioni = 0;
            state.DEBUG = "OFF";
            state.classe = [];
            state.Core = {};
            state.distanzaMediaStudenti = [];
            state.distanzaMedia = [];
            state.n_iterazioni = 0;
            state.NUMSTUDENTI = 0;
            state.NUMSTUDENTIVOTATI = 0;
            state.FrequenzeK = [];
            state.nRealGrades = 0;
            state.builded = 0;
            state.kDone = 0;
            state.nSessione = 0;
        },
        // state passa l'intero stato, c sono le variabili passate dai components
        GeneraMatriceAdiacenza: (state, c) => GeneraMatriceAdiacenza(state, c.pamode, c.NumSt, c.Voti, c.file, c.alfa, c.min, c.max),
        GeneraMatriceAdiacenzaDocenti: (state, c) => GeneraMatriceAdiacenzaDocenti(state, c.pamode, c.NumSt, c.Voti, c.file, c.alfa, c.min, c.max),
        GeneraMatriceAdiacenzaMultisessione: (state, c) => GeneraMatriceAdiacenzaMultisessione(state, c.pamode, c.Voti),
        RiempiGrafo: (state, c) => RiempiGrafo(state, c.file),
        Teacher: (state, c) => Teacher(state, c.studente, c.voto),
        Gauss: (state, c) => Gauss(state, c.NumSt, c.media, c.varianza, c.min, c.max),
        InitializeStudentModelByTeacher: (state, c) => InitializeStudentModelByTeacher(state, c.delta),
        AssignRealGrade: (state, c) => AssignRealGrade(state, c.n),
        Knn: (state) => Knn(state)
    },

    actions: {},
    getters: {}
});
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// ----------------------------------- FUNZIONI ------------------------------------------
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------

function GeneraMatriceAdiacenzaDocenti(state, pamode, NumSt, Voti, FILE, alfa, min, max) {

    //per il salvataggio su txt
    let data = "";
    let FileSaver = require('file-saver');

    console.log("votazioni tra docenti");

    //per cicli for
    let p;
    let n;
    let Grafo = [];
    let kTapp = [];
    let kT = 0;

    let F = [];

    // Se il file esiste
    if (FILE)
        F = FILE.split("\n");
    else
        F = null;

    //gestione array dinamico
    for (let i = 0; i < NumSt; i++) {
        Grafo[i] = [];
        for (let j = 0; j < NumSt; j++) {
            Grafo[i][j] = 0;
        }
    }

    // salvo data per il file

    data += NumSt + "\n"; // numero degli studenti
    data += Voti + "\n"; // numero dei voti tra pari

    // inseriamo in state alfa
    // state.alfakT = alfa;
    data += alfa + "\n";

    // voti min e max
    data += min + "\n";
    data += max + "\n";

    for (let i = 0; i < NumSt; i++) {

        if (F)
            kT = parseInt(F[i]);
        else
            kT = IntCasuale(min, max);

        // inserisco i voti del professore in un array di appoggio
        kTapp.push(kT);
    }

    // sessione di peer-assessment
    for (let i = 0; i < NumSt; i++) {

        // let KTi = kTapp[i];
        //console.log(KTi);
        //console.log(alfa);
        for (let j = 0; j < Voti; j++) {

            //assegnazione del voto ricevuto da p
            p = (1 + j + i) % NumSt;

            let KTj = kTapp[p];
            //console.log(KTj);console.log(KTj);

            // GOD MODE

            n = KTj;
            //console.log(n);

            Grafo[i][p] = n;
        }
    }


    // console.log(kTapp);

    // inserisco numero multisessione
    data += 1 + "\n";

    // Inserisco i voti del professore in base alla funzione richiamta

    for (let i = 0; i < NumSt - 1; i++) {
        data += kTapp[i] + " ";
    }
    data += kTapp[kTapp.length - 1];

    //salvataggio del grafo
    for (let i = 0; i < NumSt; i++)
        data += "\n" + Grafo[i];

    //salvo il file in locale
    let blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "mooc_" + NumSt + "_" + Voti + "_ns" + state.nSessione + ".txt");

    //this.download(data, 'mooc_00.txt', 'text/plain');
    return;
}

function GeneraMatriceAdiacenzaMultisessione(state, pamode, Voti) {
    //per il salvataggio su txt
    let data = "";
    let FileSaver = require('file-saver');

    //per cicli for
    let p;
    let n;
    let Grafo = [];

    let max = state.KMAX;
    let NumSt = state.NUMSTUDENTI;

    //gestione array dinamico
    for (let i = 0; i < NumSt; i++) {
        Grafo[i] = [];
        for (let j = 0; j < NumSt; j++) {
            Grafo[i][j] = 0;
        }
    }

    // salvo data per il file

    data += state.NUMSTUDENTI + "\n"; // numero degli studenti
    data += Voti + "\n"; // numero dei voti tra pari

    // inseriamo in state alfa
    // state.alfakT = alfa;
    data += state.alfakT + "\n";

    // voti min e max
    data += state.KMIN + "\n";
    data += state.KMAX + "\n";

    // sessione di peer-assessment
    if (pamode == "circular") {
        for (let i = 0; i < NumSt; i++) {

            let Ji = state.classe[i].j;

            //console.log(KTi);
            //console.log(alfa);
            for (let j = 0; j < Voti; j++) {

                //assegnazione del voto ricevuto da p
                p = (1 + j + i) % NumSt;

                let KPj = state.classe[p].k;

                console.log(KPj);

                //console.log(KTj);console.log(KTj);

                n = votoIntMulti(KPj, Ji, max);
                //console.log(n);

                Grafo[i][p] = n;
            }
        }
    } else if (pamode == "random") {
        const MAXASS = 50;
        let n;
        let nAssessments = Voti;
        let nStudenti = NumSt;
        let numeri = [nStudenti];

        try {
            while (nAssessments > nStudenti || nAssessments > MAXASS) {
                console.error("Numero di Assessments troppo elevato!\n");
            }

            let matrice = [];
            // let matrice = [nStudenti][nAssessments];
            for (let i = 0; i < nStudenti; i++) {
                matrice[i] = [];
                for (let j = 0; j < nAssessments; j++) {
                    matrice[i][j] = 0;
                }
            }
            // riempi con i numeri interi delle posizioni nella matrice di adiacenza
            for (let i = 0; i < nStudenti; i++) {
                numeri[i] = i;
            }

            // NB max studenti 32000
            // srand(time(NULL));

            for (let j = 0; j < nAssessments; j++) {
                for (let i = 0; i < nStudenti; i++) {
                    do {
                        n = Math.floor(Math.random() * nStudenti);
                        //printf("n=%d\n",n);
                        //printf("numeri[%d]=%d n=%d\n",i,numeri[i],n);

                        //system("pause");
                    } while (i == n || numeri[n] == -1);
                    matrice[i][j] = n;
                    //printf("passo\n");
                    numeri[n] = -1;
                }

                for (let i = 0; i < nStudenti; i++) {
                    //printf("%d\n",numeri[i]);
                    numeri[i] = i;
                }
            }
            // scrivi su file
            //  printf("Nome del file:\n");
            //  scanf("%s",nomeFile);
            //  fp=fopen(nomeFile,"w+");
            for (let y = 0; y < nStudenti; y++) {
                // let KTi = kTapp[y];
                let Ji = state.classe[y].j;
                //console.log(KTi);
                //console.log(alfa);
                for (let i = 0; i < nAssessments; i++) {
                    console.log(matrice[y][i]);
                    // fprintf(fp,"%d,",matrice[y][i]);
                    //assegnazione del voto ricevuto da p
                    p = matrice[y][i];

                    // let KTj = kTapp[p];
                    let KPj = state.classe[p].k;
                    //console.log(KTj);console.log(KTj);

                    // n = votoInt(KTi, KTj, alfa, min, max);
                    n = votoIntMulti(KPj, Ji, max);
                    //console.log(n);

                    Grafo[y][p] = n;
                }
                console.log("\n");
                // fprintf(fp,"\n");
            }
        } catch (error) {
            console.error(error);
        }

    } else {
        console.error("selezione non valida");
    }

    // console.log(kTapp);

    // inserisco numero multisessione
    let nSessione = parseInt(state.nSessione) + 1;
    data += nSessione + "\n";

    // Inserisco i voti del professore in base alla funzione richiamta

    for (let i = 0; i < NumSt - 1; i++) {
        data += state.TeacherGrades[i] + " ";
    }
    data += state.TeacherGrades[state.TeacherGrades.length - 1];

    //salvataggio del grafo
    for (let i = 0; i < NumSt; i++)
        data += "\n" + Grafo[i];

    //salvo il file in locale
    let blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "mooc_" + NumSt + "_" + Voti + "_ns" + nSessione + ".txt");

    //this.download(data, 'mooc_00.txt', 'text/plain');
    return;

}

function GeneraMatriceAdiacenza(state, pamode, NumSt, Voti, FILE, alfa, min, max) {

    //per il salvataggio su txt
    let data = "";
    let FileSaver = require('file-saver');

    //per cicli for
    let p;
    let n;
    let Grafo = [];
    let kTapp = [];
    let kT = 0;

    let F = [];

    // Se il file esiste
    if (FILE)
        F = FILE.split("\n");
    else
        F = null;

    //gestione array dinamico
    for (let i = 0; i < NumSt; i++) {
        Grafo[i] = [];
        for (let j = 0; j < NumSt; j++) {
            Grafo[i][j] = 0;
        }
    }

    // salvo data per il file

    data += NumSt + "\n"; // numero degli studenti
    data += Voti + "\n"; // numero dei voti tra pari

    // inseriamo in state alfa
    // state.alfakT = alfa;
    data += alfa + "\n";

    // voti min e max
    data += min + "\n";
    data += max + "\n";

    for (let i = 0; i < NumSt; i++) {

        if (F)
            kT = parseInt(F[i]);
        else
            kT = IntCasuale(min, max);

        // inserisco i voti del professore in un array di appoggio
        kTapp.push(kT);
    }

    // sessione di peer-assessment
    if (pamode == "circular") {
        for (let i = 0; i < NumSt; i++) {

            let KTi = kTapp[i];
            //console.log(KTi);
            //console.log(alfa);
            for (let j = 0; j < Voti; j++) {

                //assegnazione del voto ricevuto da p
                p = (1 + j + i) % NumSt;

                let KTj = kTapp[p];
                //console.log(KTj);console.log(KTj);

                n = votoInt(KTi, KTj, alfa, min, max);
                //console.log(n);

                Grafo[i][p] = n;
            }
        }
    } else if (pamode == "random") {
        const MAXASS = 50;
        let n;
        let nAssessments = Voti;
        let nStudenti = NumSt;
        let numeri = [nStudenti];

        try {
            while (nAssessments > nStudenti || nAssessments > MAXASS) {
                console.error("Numero di Assessments troppo elevato!\n");
            }

            let matrice = [];
            // let matrice = [nStudenti][nAssessments];
            for (let i = 0; i < nStudenti; i++) {
                matrice[i] = [];
                for (let j = 0; j < nAssessments; j++) {
                    matrice[i][j] = 0;
                }
            }
            // riempi con i numeri interi delle posizioni nella matrice di adiacenza
            for (let i = 0; i < nStudenti; i++) {
                numeri[i] = i;
            }

            // NB max studenti 32000
            // srand(time(NULL));

            for (let j = 0; j < nAssessments; j++) {
                for (let i = 0; i < nStudenti; i++) {
                    do {
                        n = Math.floor(Math.random() * nStudenti);
                        //printf("n=%d\n",n);
                        //printf("numeri[%d]=%d n=%d\n",i,numeri[i],n);

                        //system("pause");
                    } while (i == n || numeri[n] == -1);
                    matrice[i][j] = n;
                    //printf("passo\n");
                    numeri[n] = -1;
                }

                for (let i = 0; i < nStudenti; i++) {
                    //printf("%d\n",numeri[i]);
                    numeri[i] = i;
                }
            }
            // scrivi su file
            //  printf("Nome del file:\n");
            //  scanf("%s",nomeFile);
            //  fp=fopen(nomeFile,"w+");
            for (let y = 0; y < nStudenti; y++) {
                let KTi = kTapp[y];
                //console.log(KTi);
                //console.log(alfa);
                for (let i = 0; i < nAssessments; i++) {
                    console.log(matrice[y][i]);
                    // fprintf(fp,"%d,",matrice[y][i]);
                    //assegnazione del voto ricevuto da p
                    p = matrice[y][i];

                    let KTj = kTapp[p];
                    //console.log(KTj);console.log(KTj);

                    n = votoInt(KTi, KTj, alfa, min, max);
                    //console.log(n);

                    Grafo[y][p] = n;
                }
                console.log("\n");
                // fprintf(fp,"\n");
            }
        } catch (error) {
            console.error(error);
        }

    } else {
        console.error("selezione non valida");
    }

    // console.log(kTapp);

    // inserisco numero multisessione
    data += 1 + "\n";

    // Inserisco i voti del professore in base alla funzione richiamta

    for (let i = 0; i < NumSt - 1; i++) {
        data += kTapp[i] + " ";
    }
    data += kTapp[kTapp.length - 1];

    //salvataggio del grafo
    for (let i = 0; i < NumSt; i++)
        data += "\n" + Grafo[i];

    //salvo il file in locale
    let blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "mooc_" + NumSt + "_" + Voti + "_ns" + 1 + ".txt");

    //this.download(data, 'mooc_00.txt', 'text/plain');
    return;
}

function IntCasuale(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function votoInt(KTi, KTj, alfa, min, max) {

    const beta = Math.random();
    const KMAX = max;
    const J = ((KTi - min) / (max - min)) * alfa;

    // console.log("J=" + J);
    // console.log("KTi=" + KTi);

    const kP = parseInt(KTj + beta * (KMAX - KTj) * (1 - J));

    // console.log("kP:" + kP);

    return kP;
}
function votoIntMulti(KPj, Ji, max) {

    const beta = Math.random();
    const KMAX = max;
    const J = Ji;

    // console.log("J=" + J);
    // console.log("KTi=" + KTi);

    const kP = parseInt(KPj + beta * (KMAX - KPj) * (1 - J));

    // console.log("kP:" + kP);

    return kP;
}

function RiempiGrafo(state, FILE) {

    // inizio il parsing dividendo l'array per ogni a capo del testo
    const F = FILE.split("\n");

    if (!FILE) {
        FILE = null;
        return;
    }

    let i = 0;
    let j = 0;

    // Retrieving data:
    if (isNaN(F[0]))
        return;

    state.NUMSTUDENTI = parseInt(F[0]);
    state.NUMSTUDENTIVOTATI = parseInt(F[1]);
    state.alfakT = parseFloat(F[2]);
    state.KMIN = parseInt(F[3]);
    state.KMAX = parseInt(F[4]);
    state.nSessione = parseInt(F[5]);

    // console.log("\n\n\n\nKMIN: " + state.KMIN);
    // console.log("\n\n\n\nKMAX:" + state.KMAX);

    // TeacherGrades
    state.TeacherGrades = F[6].split(" ");
    for (i = 0; i < state.NUMSTUDENTI; i++) {
        state.TeacherGrades[i] = parseInt(state.TeacherGrades[i]);
    }

    // Grafo
    for (i = 0; i < state.NUMSTUDENTI; i++) {
        state.Grafo[i] = F[7 + i].split(",");

        for (j = 0; j < state.NUMSTUDENTI; j++) {

            state.Grafo[i][j] = parseFloat(state.Grafo[i][j]);
            // state.Grafo[i][j] = parseInt(state.Grafo[i][j]);
        }

        state.cont[i] = 0;
    }

    let primaRiga = state.Grafo[0];
    let contaZero = 0;

    primaRiga.forEach(element => {
        if (element == 0) contaZero++;
    });

    state.contaZero = contaZero;


    /* inizializzazione modelli */
    InizializzaCore(state);
    InizializzaModelloStudente(state);
    UpdateDelta(state);
    //state.OrdinaStudentiDev(); non + necessario con vue
    //state.VisualizzaStudentiAll(); non + necessario con vue
    //VisualizzaStudentiNoCore();
    return;
}

function InizializzaCore(state) {

    let i = 0;
    let j = 0;

    const NO_STUDENT = -1;
    const NO_CORE = 0;
    const NO_DEV = -1;

    // inizializza struttura Core
    state.Core = new state.STUDENTECORE(0);

    // aggioirna core
    for (i = 0; i < state.NUMSTUDENTI; i++) {
        state.Core.IndexCore.push(NO_STUDENT);
    }

    // Inizializza modelli studenti: compreso anche il modello reale
    for (i = 0; i < state.NUMSTUDENTI; i++) {

        // STUDENTE(index, j, k, kt, jt, kTeacher, stato, dev, delta, backStudent, distanza, pointer, precpointer)
        state.classe[i] = new state.STUDENTE(NO_STUDENT, 0, 0, 0, 0, 0, NO_CORE, NO_DEV, 0.0, 0);

        for (j = 0; j < state.NUMSTUDENTI; j++) {
            state.classe[i].precpointer.push(NO_STUDENT);
            state.classe[i].pointer.push(NO_STUDENT);
            state.classe[i].distanza.push(NO_STUDENT);
        }
    }

    return;
}

function InizializzaModelloStudente(state) {

    // nella gestione della nuova rete
    const alfa = state.alfakT;

    // inizializza K
    for (let i = 0; i < state.NUMSTUDENTI; i++) {

        state.classe[i].index = i;
        state.classe[i].k = InizializzaK(state, i);
    }

    //Inizializza J
    for (let i = 0; i < state.NUMSTUDENTI; i++) {

        // vechhio sistema
        // state.classe[i].j = InizializzaJ(state, i);

        // adesso j è kReal * alfa
        state.classe[i].j = state.TeacherGrades[i] * alfa;
    }

    // inizializza dev
    for (let i = 0; i < state.NUMSTUDENTI; i++) {

        state.classe[i].dev = InizializzaDev(state, i);

    }

    //inizializza core
    for (let i = 0; i < state.NUMSTUDENTI; i++) {

        state.classe[i].stato = 0;
        state.classe[i].backStudent = 0; // non ho aggiornato chi lo ha votato
        state.classe[i].delta = 0;
        state.classe[i].kt = state.TeacherGrades[i];
    }

    return;

}

function InizializzaK(state, index) {

    let somma = 0;

    // somma di tutti i voti ricevuti dallo studente (index)
    for (let i = 0; i < state.NUMSTUDENTI; i++) {
        somma = somma + state.Grafo[i][index];
    }

    // ritorna il voto medio dello studente dopo il peer-assessment
    return parseFloat(somma / state.NUMSTUDENTIVOTATI);
}

function InizializzaDev(state, index) {

    let scarto = 0;

    for (let i = 0; i < state.NUMSTUDENTI; i++) {
        if (state.Grafo[i][index])
            scarto = scarto + Math.pow((state.Grafo[i][index] - state.classe[index].k), 2);
    }

    return (Math.sqrt(scarto / state.NUMSTUDENTIVOTATI));
}

function Teacher(state, s, v) {

    let i;
    const q = state.Core.QuantiCore;
    const studente = parseInt(s);
    const voto = parseInt(v);

    AggiornaModelloStudenteIniziale(state, studente, voto);
    // aggiornamneto array pointer=puntatore agli elementi CORE

    for (i = 0; i < state.NUMSTUDENTI; i++) {

        state.classe[i].pointer[q] = studente;
        // attenzione è index
    }

    //classe[i].stato=CORE;
    //Aggiornamento struttura core
    state.Core.IndexCore[q] = studente;
    state.Core.QuantiCore++;
    state.NumeroCore++;

    // VisualizzaStudentiAll(); in HTML inutile due volte
    // NO-----AggiornaSoloChiMiHaVotato(studente);
    ModificaReteBackStudenteVotato(state, studente);
    InizializzaTuttiDev(state);
    UpdateDelta(state);
    //VisualizzaStudentiAll();

    return;
}

function AggiornaModelloStudenteIniziale(state, studente, voto) {

    let alfa,
        Kold,
        Jnew,
        Jold;
    const IMAX = state.KMAX - state.KMIN;
    const JMAX = 1;
    const CORE = 1;

    //trova lo studente
    const Kteacher = voto;
    for (let i = 0; i < state.NUMSTUDENTI; i++) {
        if (state.classe[i].index == studente) {

            state.classe[i].stato = CORE;
            //salva vecchio voto dato dai peer
            Kold = state.classe[i].k;
            //aggiorna K con il voto del docente
            //state.classe[i].k=Kteacher;
            state.classe[i].kTeacher = Kteacher;
            // ricalcola la deviazione standard
            //state.classe[i].dev=state.CambiaDev(i,studente);
            state.classe[i].dev = () => {
                let scarto = 0;

                for (let i = 0; i < state.NUMSTUDENTI; i++) {
                    if (state.Grafo[i][studente])
                        scarto += Math.pow((Kteacher - state.Grafo[i][studente]), 2);
                }
                return Math.sqrt(scarto / state.NUMSTUDENTIVOTATI);
            }
            // salva il vecchio j
            Jold = state.classe[i].j;
            //aggiorna J
            //alfa=(k_teacher - k_old)/IMAX
            alfa = (Kteacher - Kold) / IMAX;

            // (0<= a <= 1) Jnew=Jold+alfa*(JMAX-Jold);
            // (a<0) Jnew=Jold+alfa*Jold;
            if ((alfa >= 0) && (alfa <= 1))
                Jnew = Jold + alfa * (JMAX - Jold);
            else if (alfa < 0)
                Jnew = Jold + (alfa * Jold);

            state.classe[i].j = Jnew;
            //aggiorna stato
            //trovo lo studebnte con l'index giusto
        }
    }
    return;
}

function CambiaDev(state, j, index) {
    let scarto = 0;

    //dev_new=sqrt(sum(k_li - k_i)^2)/n

    for (let i = 0; i < state.NUMSTUDENTI; i++) {
        if (state.Grafo[i][index])
            scarto += Math.pow((state.Grafo[i][index] - state.classe[j].k), 2);
    }
    return Math.sqrt(scarto / state.NUMSTUDENTIVOTATI);
}

function ModificaReteBackStudenteVotato(state, studente) {

    // copio le variabili per poi recuperarle successivamente
    const cont = JSON.parse(JSON.stringify(state.cont));

    // aggiorna gli studenti dopo il voto del docente
    AggiornaRete(state, 0, studente);

    state.cont = JSON.parse(JSON.stringify(cont));

    return;
}

function AggiornaRete(state, riga, colonna) {

    let i;
    let arr = []; //idea di array per salvare parti di grafo utili
    let c = colonna;
    while (state.cont[c] != state.NUMSTUDENTIVOTATI) {

        for (i = 0; i < state.NUMSTUDENTI; i++) {

            if (state.Grafo[i][c] > 0) {

                //qui ci salviamo le coordinate e il valore del grafo
                arr.push(i, c, state.Grafo[i][c]);

                state.Grafo[i][c] = -1;
                state.cont[c] += 1;

                ModificaModelloStudente(state, i, c);
                c = i;
                //state.AggiornaRete(0,i);

                //ModificaModelloStudente(i,colonna);
            }
        }
    }
    // console.log(arr);
    // console.log(state.cont);

    // WORKAROUND PER NON COPIARE L'INTERO GRAFO!!!!!
    // OTTIMO PER LA MEMORIA
    //console.log(arr);
    for (i = 0; i < arr.length - 2; i += 3)
        state.Grafo[arr[i]][arr[i + 1]] = arr[i + 2];

    return;
}

function ModificaModelloStudente(state, studenteVotante, studenteVotato) {

    const CORE = 1;
    const KMAX = state.KMAX;
    const IMAX = state.KMAX - state.KMIN;
    const JMAX = 1;
    let i;
    let alfa;

    // STUDENTE    sVotante,sVotato,p;
    let sVotante = new state.STUDENTE();
    let sVotato = new state.STUDENTE();
    let p = new state.STUDENTE();

    let K_New,
        beta,
        JNew,
        K_Old;

    // controllo se studente votante è core

    for (i = 0; i < state.NUMSTUDENTI; i++) {

        if (state.classe[i].index == studenteVotato) {

            sVotato = state.classe[i];

        } else if (state.classe[i].index == studenteVotante) {

            if (state.classe[i].stato == CORE) {

                return;
            }

            sVotante = state.classe[i];
        }

    }

    p = sVotante;
    //calcolo nuovo J sia per S+ che per S-

    K_Old = p.k; // salvataggio per beta

    alfa = CalcolaAlfa(IMAX, sVotante, sVotato);

    if (alfa < 0) {
        p.k = sVotante.k + alfa * (1 - sVotante.k);
    } else {

        p.k = sVotante.k + alfa * (KMAX - sVotante.k);
    }

    //aggiorna J
    K_New = p.k;
    beta = CalcolaBeta(IMAX, sVotante, sVotato, K_Old, K_New);
    if ((beta == 0) && (sVotato.j == sVotante.j)) {

        JNew = sVotante.j + (sVotante.k - K_Old) / IMAX;
    } else if ((beta >= 0) && (beta <= 1)) {

        JNew = sVotante.j + beta * (JMAX - sVotante.j);
    } else if (beta < 0) {

        JNew = sVotante.j + beta * sVotante.j;
    } else {

        JNew = sVotante.j;
    }

    // aggiorna modello studente
    p.j = JNew;
    for (i = 0; i < state.NUMSTUDENTI; i++) {

        if (state.classe[i].index == studenteVotante) {
            state.classe[i] = p;
            //state.classe[i].dev=InizializzaDev(i);
        }
    }
    //fclose(fp);

    return;
}

function CalcolaAlfa(im, pVotante, pVotato) {
    const IMAX = im;
    const DEVMAX = 4.5;

    let alfa = 0;
    //utilizzo la stessa formula dei J+. I core non li aggiorno++

    alfa = (1 / IMAX) * (pVotante.k - pVotato.k) * (pVotante.dev / DEVMAX);

    //document.getElementById("input4").innerHTML = "alfa: " + alfa;
    return alfa;
}

function CalcolaBeta(im, pVotante, pVotato, K_old, K_new) {
    const IMAX = im;
    const DEVMAX = 4.5;
    var beta = 0;

    beta = (1 / IMAX) * (K_new - K_old) * Math.abs(pVotato.j - pVotante.j) * (pVotante.dev / DEVMAX);

    //document.getElementById("input5").innerHTML = "beta: " + beta;
    return beta;
}

function InizializzaTuttiDev(state) {

    for (let i = 0; i < state.NUMSTUDENTI; i++)
        state.classe[i].dev = CambiaDev(state, i, state.classe[i].index);
    return;
}

function Gauss(state, numGen, mediaInput, varianzaInput, votoInf, votoSup) {

    let FileSaver = require('file-saver');
    let fp = "";
    let p, j, m;
    let voti = [];

    //generaRand(voti,numGen,votoInf,votoSup);
    //system("pause");
    for (let i = 0; i < numGen; i++) {
        p = randn_bm();
        voti[i] = (varianzaInput * p + mediaInput);
        // arrotondamento a 0.5
        j = parseInt(voti[i]); // per difetto
        m = j + 1;
        if (voti[i] <= j + 0.5)
            voti[i] = j;
        else
            voti[i] = m;
        while (voti[i] > (votoSup) || voti[i] < votoInf) {
            voti[i] = varianzaInput * randn_bm() + mediaInput;
            j = parseInt(voti[i]); // per difetto
            m = j + 1;
            if (voti[i] <= j + 0.5)
                voti[i] = parseInt(j);
            else
                voti[i] = parseInt(m);
        }

        fp += voti[i] + "\n";
    }

    //salvo il file in locale
    let blob = new Blob([fp], {
        type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "grade_" + numGen + ".txt");

    // Ripristina array + var
    state.Grafo = [];
    state.TeacherGrades = [];
    state.NUMSTUDENTI = 0;
    state.NUMSTUDENTIVOTATI = 0;
    state.cont = [];

    return;
}

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function InitializeStudentModelByTeacher(state, delta) {
    //aggiorno jt
    for (let i = 0; i < state.NUMSTUDENTI; i++) {

        state.classe[i].k = state.classe[i].kt + delta * (10 - state.classe[i].kt);
        state.classe[i].j = (state.classe[i].k - 1) / (8 + Math.exp((state.classe[i].k - 10)));

    }
    return;
}

function AssignRealGrade(state, n) {
    const CORE = 1;
    const ON = 1;
    // aggiornamento ultimi n
    // Aggiornamneto K
    SortBySd(state);

    for (let i = 0; i < n; i++) {
        let indice = (state.NUMSTUDENTI - 1 - i);

        // Cambio voto
        state.classe[indice].k = state.classe[indice].kt;
        // Cambio delta
        state.classe[indice].delta = 0;
        state.classe[indice].kTeacher = state.classe[indice].kt;
        // diventano tutti studenti CORE
        state.classe[indice].stato = CORE;
        state.classe[indice].backStudent = ON;
        // Aggiornamento Dev
        // se sono core che li aggiorno a fare?

        // let index=state.classe[indice].index;
        // console.log("indice: ", index);
        // state.classe[indice].dev=parseFloat(state.CambiaDev(i,index));
    }
    // NB: Dev e J li ricalcoliamo quando aggiorniamo tutti i peers che hanno votato questo o questi studenti
    state.nRealGrades += n;
    state.NumeroCore += n;

    // state.SortBySd();
    SortById(state);
    StudentsUpdateWithRealGrades(state);

    return;
}

function StudentsUpdateWithRealGrades(state) {
    const OFF = 0;
    // comincio da ciascuno studente e aggiorno quando trovo il campo a ON; dopo lo metto a OFF;
    for (let i = 0; i < state.NUMSTUDENTI; i++) {

        if (state.classe[i].backStudent && state.classe[i].stato) {

            let studente = state.classe[i].index;

            let voto = state.classe[i].kTeacher;
            // console.log("ID= ", studente, " Voto= ", voto);
            // system("pause");
            AggiornaModelloStudenteIniziale(state, studente, voto);
            state.classe[i].backStudent = OFF;
            ModificaReteBackStudenteVotato(state, studente);
            InizializzaTuttiDev(state);
            UpdateDelta(state);
            // VisualizzaStudentiAll();
        }

    }
    // console.log("Done");
    return;
}

// aggiornamento dei delta
function UpdateDelta(state) {
    for (let i = 0; i < state.NUMSTUDENTI; i++)
        state.classe[i].delta = Math.abs(state.classe[i].k - state.classe[i].kt);

    return;
}

function SortBySd(state) {

    let p;

    // ordinamento secondo SD
    for (let i = 0; i < state.NUMSTUDENTI - 1; i++) {
        for (let j = 0; j < state.NUMSTUDENTI - i - 1; j++) {
            if (state.classe[j].delta > state.classe[j + 1].delta) {
                p = state.classe[j];
                state.classe[j] = state.classe[j + 1];
                state.classe[j + 1] = p;
            }
        }
    }

    return;
}

function SortById(state) {

    let p;

    // ordinamento secondo SD
    for (let i = 0; i < state.NUMSTUDENTI - 1; i++) {
        for (let j = 0; j < state.NUMSTUDENTI - i - 1; j++) {
            if (state.classe[j].index > state.classe[j + 1].index) {
                p = state.classe[j];
                state.classe[j] = state.classe[j + 1];
                state.classe[j + 1] = p;
            }
        }
    }

    return;
}

function Knn(state) {

    // ----------- costanti ---------------
    const IMAX = state.KMAX - state.KMIN;
    const JMAX = 1;
    const NO_CORE = 0;
    const KMAX = state.KMAX;
    const KNN = 3;
    const DEVMAX = 4.5;

    const MAX_ITERAZIONI = 50;

    let x,
        KOld,
        sommaNum,
        sommaDen;
    let l,
        j;

    let i,
        p,
        cambio,
        flag;

    let alfa,
        q,
        beta;

    state.n_iterazioni = 0;

    do {
        flag = 0;
        // console.log("============Iterazione KNN %d  ===============\n", state.n_iterazioni++);
        //printf("============Iterazione KNN %d  ===============\n",n_iterazioni++);
        //system("pause");

        state.n_iterazioni++;

        for (i = 0; i < state.NUMSTUDENTI; i++) {
            //index=state.classe[i].index;


            if (state.classe[i].stato == NO_CORE) {

                // Modifica studenti no core


                for (l = 0; l < state.Core.QuantiCore; l++) {
                    let pp = state.classe[i].pointer[l];

                    state.classe[i].distanza[l] = distanzaEuclidea(state.classe[i].k, state.classe[i].j, state.classe[pp].k, state.classe[pp].j);

                    //classe[i].pointer[l]=Core.IndexCore[l];

                }
            }
        }
        //printf("=================================================\n");
        //system("pause");

        //system("pause");
        //per ogni studente ordino le distanze


        for (i = 0; i < state.NUMSTUDENTI; i++) {

            //aggiorno K
            //alfa

            if (state.classe[i].stato == NO_CORE) {

                //controllo se i primi KNN sono gli stessi della volta precedente

                for (j = 0; j < state.Core.QuantiCore - 1; j++) {
                    for (l = 0; l < state.Core.QuantiCore - 1 - j; l++) {

                        if (state.classe[i].distanza[l] > state.classe[i].distanza[l + 1]) {
                            // gestisco la distanza
                            x = state.classe[i].distanza[l];
                            state.classe[i].distanza[l] = state.classe[i].distanza[l + 1];
                            state.classe[i].distanza[l + 1] = x;
                            //sposto i puntatori
                            p = state.classe[i].pointer[l];
                            state.classe[i].pointer[l] = state.classe[i].pointer[l + 1];
                            state.classe[i].pointer[l + 1] = p;
                        }
                    }
                }

                cambio = VerificaCambiamentoPuntiKNN(state, i, KNN);

                // cambiamento: i primi K non sono gli stessi della volta precedente


                if (cambio != 0) {
                    flag = 1;
                    //printf("=========CAMBIO NEIGHBOUR STUDENT %d\n",classe[i].index);
                    //system("pause");

                    sommaDen = 0;
                    sommaNum = 0;

                    // il problema è qui con (pochi studenti)-----------------------------

                    for (l = 0; l < KNN; l++) {
                        let pp = state.classe[i].pointer[l];

                        sommaNum += (state.classe[pp].k - state.classe[i].k) / distanzaEuclidea(state.classe[pp].k, state.classe[pp].j, state.classe[i].k, state.classe[i].j);
                        sommaDen += (1 / distanzaEuclidea(state.classe[pp].k, state.classe[pp].j, state.classe[i].k, state.classe[i].j));

                        //txt += sommaNum + " " + sommaDen + "<br>";

                    }

                    // ---------------------------------------------


                    KOld = state.classe[i].k;
                    alfa = (1 / IMAX) * (sommaNum / sommaDen) * (state.classe[i].dev / DEVMAX); // fattore spostamento dev
                    // if(DEBUG)

                    // console.log(sommaNum, sommaDen, alfa);
                    //printf("Sommanum=%f|SommaDen=%f|alfa=%f\n",sommaNum,sommaDen, alfa);
                    //system("pause");

                    if (alfa < 0) {
                        //state.classe[i].k=state.classe[i].k+alfa*(1-state.classe[i].k);
                        state.classe[i].k = state.classe[i].k + alfa * (state.classe[i].k)

                    } else if (alfa >= 0 && alfa <= 1) {
                        state.classe[i].k = state.classe[i].k + alfa * (KMAX - state.classe[i].k);
                    }
                    //state.classe[i].dev=InizializzaDev(i);
                    //aggiorno j
                    q = (state.classe[i].k - KOld) / IMAX;
                    // con fattore di spostamento

                    sommaDen = 0;
                    sommaNum = 0;

                    // il problem è anche qui con pochi studenti ------------------------------------------------

                    for (l = 0; l < KNN; l++) {
                        let pp = state.Core.IndexCore[l];
                        sommaNum += Math.abs(state.classe[pp].j - state.classe[i].j) / distanzaEuclidea(state.classe[pp].k, state.classe[pp].j, state.classe[i].k, state.classe[i].j);
                        sommaDen += (1 / distanzaEuclidea(state.classe[pp].k, state.classe[pp].j, state.classe[i].k, state.classe[i].j));

                        //txt += sommaNum + " " + sommaDen + "<br>";
                    }

                    //document.getElementById("input1").innerHTML = sommaNum + " " + sommaDen;

                    // -------------------------------------------------------------------

                    beta = (q * sommaNum / sommaDen) * (state.classe[i].dev / DEVMAX);
                    KOld = state.classe[i].k;

                    if (beta < 0)
                        state.classe[i].j = state.classe[i].j + beta * state.classe[i].j;
                    else if (beta >= 0 && beta <= 1)
                        state.classe[i].j = state.classe[i].j + beta * (JMAX - state.classe[i].j);
                    else if (beta > 0 && sommaNum == 0)
                        state.classe[i].j = state.classe[i].j + (1.0 / IMAX) * (state.classe[i].k - KOld);

                }

            }

        }

        // aggiornamento precpointer

        for (i = 0; i < state.NUMSTUDENTI; i++) {

            for (j = 0; j < state.Core.QuantiCore; j++) {
                state.classe[i].precpointer[j] = state.classe[i].pointer[j];

            }

        }
        // aggiornamento dev

    } while (state.n_iterazioni <= MAX_ITERAZIONI && flag != 0);

    InizializzaTuttiDev(state);
    UpdateDelta(state);

    return;
}
// Questa funzione aggiorna tutta la rete a partire dagli S+

function distanzaEuclidea(x, y, sx, sy) {

    let a,
        b;

    a = Math.pow((x - sx), 2);
    b = Math.pow((y - sy), 2);

    return Math.sqrt(a + b);

}

function VerificaCambiamentoPuntiKNN(state, i, knn) {

    let flag = 0;

    for (let l = 0; l < knn; l++) {

        // c'è stato un cambiamento ma non sappiamo se incide sulle distanze rispetto a K
        if (state.classe[i].pointer[l] != state.classe[i].precpointer[l])
            flag = 1;
    }

    return flag;
}
