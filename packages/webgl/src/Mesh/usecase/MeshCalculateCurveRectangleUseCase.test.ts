import { execute } from "./MeshCalculateCurveRectangleUseCase";
import { describe, expect, it } from "vitest";
import type { IPoint } from "../../interface/IPoint";

describe("MeshCalculateCurveRectangleUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const paths = execute({ x: 90, y: 120 }, { x: 91, y: 30 }, { x: 210, y: 100 }, 3);
        console.log(paths);
        expect(paths).toEqual([
            92.99981483195982,  120.03333127591067, false,              
            93.05847547276832, 117.3240110485681,  true,
            93.17318295655153,  114.69644017912968,
            false,              93.34367026233961,  112.15082173105502, true,
            93.56963219245895,  109.68735553811679, false,              93.85072148852632,
            107.30623263017817, true,               94.1865452260656,   105.00762801604638,
            false,              94.57666184035824,  102.79169154406925, true,
            95.02057926829268,  100.65853658536585, false,              95.51775484509592,
            98.60822635509618,  true,               96.06759776086137,  96.64075782500278,
            false,              96.66947503891528,  94.75604340895377,  true,
            97.32272211068204,  92.95389094370037,  false,              98.02665907650476,
            91.23398295079949,  true,               98.78061358848315,  89.59585674157303,
            false,              99.58395089022275,  88.03888756599137,  true,
            100.43611082961729, 86.56227760606654,  false,              101.33665059664483,
            85.16505401183957,  true,               102.28529058535305, 83.84607916258767,
            false,              103.28195931875285, 82.60407569277815,  true,
            104.32683212636016, 81.43766741183478,  false,              105.42035764347963,
            80.3454351028803,   true,               106.56326661234834, 79.32598359435116,
            false,              107.75655913230267, 78.37801400052852,  true,
            109.00146931659933, 77.50039330253732,  false,              110.29940975721478,
            76.69221308618341,  true,               111.65190147232951, 75.9528305305225,
            false,              113.06049727545003, 75.28188743265633,  true,
            114.52670719235728, 74.67930650301508,  false,              116.05193357124341,
            74.14526750807323,  true,               117.63742127341362, 73.68016831446116,
            false,              119.28422548424233, 73.28457708301556,  true,
            120.99319696191607, 72.95918177149643,  false,              122.76498246545046,
            72.70474205039667,
            true,
            124.60003690142062,
            72.52204718028263,
            false,
            126.49864336287645,
            72.41188177635226,
            true,
            128.4609375,
            72.375,
            false,
            130.4869333010182,
            72.41210771438614,
            true,
            132.57654814099826,
            72.5238515382499,
            false,
            134.72962570923485,
            72.71081346697419,
            true,
            136.9459560591959,
            72.97350970751056,
            false,
            139.22529250334242,
            73.31239250022244,
            true,
            141.5673654021229,
            73.72785389983642,
            false,
            143.97189309579554,
            74.22023070624105,
            true,
            146.4385903300649,
            74.78980994154595,
            false,
            148.9671745613114,
            75.43683444640628,
            true,
            151.5573705189908,
            76.16150831075156,
            false,
            154.20891337013802,
            76.96400196276316,
            true,
            156.9215507867719,
            77.8444568194639,
            false,
            159.6950441697604,
            78.80298945800155,
            true,
            162.52916923735802,
            79.83969530397181,
            false,
            165.42371614579625,
            80.95465185664783,
            true,
            168.3784892740845,
            82.14792148463907,
            false,
            171.3933067757061,
            83.41955383231668,
            true,
            174.4679999758045,
            84.76958787959106,
            false,
            177.60241267312426,
            86.19805369696745,
            true,
            180.79640039069227,
            87.7049739354066,
            false,
            184.04982960730766,
            89.29036508718556,
            true,
            187.3625769927208,
            90.95423855022293,
            false,
            190.73452866237673,
            92.69660152454583,
            true,
            194.16557946231575,
            94.51745776594173,
            false,
            197.65563229088735,
            96.41680821847216,
            true,
            201.20459746103566,
            98.39465154448482,
            false,
            204.81239210481624,
            100.45098456806144,
            true,
            208.47893962030983,
            102.58580264547331,
            false,
            211.52106037969017,
            97.41419735452669,
            false,
            207.80772508268376,
            95.25214043193856,
            true,
            204.15087128896434,
            93.16784845551518,
            false,
            200.55042239661265,
            91.16131678152784,
            true,
            197.00629553768425,
            89.23254223405827,
            false,
            193.51840102512327,
            87.38152347545417,
            true,
            190.0866417572792,
            85.60826144977707,
            false,
            186.71091258019234,
            83.91275991281444,
            true,
            183.39109960930773,
            82.2950260645934,
            false,
            180.12707951437574,
            80.75507130303255,
            true,
            176.9187187741955,
            79.29291212040894,
            false,
            173.7658729117939,
            77.90857116768332,
            true,
            170.6683857259155,
            76.60207851536093,
            false,
            167.62608854170375,
            75.37347314335217,
            true,
            164.63879951264198,
            74.22280469602819,
            false,
            161.7063230177396,
            73.15013554199845,
            true,
            158.8284492132281,
            72.1555431805361,
            false,
            156.00495381736198,
            71.23912303723684,
            true,
            153.2355982310092,
            70.40099168924844,
            false,
            150.5201301261886,
            69.64129055359372,
            true,
            147.8582846699351,
            68.96019005845405,
            false,
            145.24978659170446,
            68.35789429375895,
            true,
            142.6943533478771,
            67.83464610016358,
            false,
            140.19169968415758,
            67.39073249977756,
            true,
            137.7415439408041,
            67.02649029248944,
            false,
            135.34361647826515,
            66.74231153302581,
            true,
            132.99767060900174,
            66.5386484617501,
            false,
            130.7034963864818,
            66.41601728561386,
            true,
            128.4609375,
            66.375,
            false,
            126.26991132462355,
            66.41624322364774,
            true,
            124.13043184857938,
            66.54045281971737,
            false,
            122.04263472204954,
            66.74838294960333,
            true,
            120.00680303808393,
            67.04081822850357,
            false,
            118.02339170325767,
            67.41854791698444,
            true,
            116.09304747658638,
            67.88233168553884,
            false,
            114.21662111625659,
            68.43285749192677,
            true,
            112.39516780764272,
            69.07069349698492,
        false,
        110.62993241204997,
        69.79623756734367,
        true,
        108.92231727767049,
        70.6096694694775,
        false,
        107.27383243028522,
        71.51091191381659,
        true,
        105.68603068340067,
        72.49960669746268,
        false,
        104.16043305519733,
        73.57511099947148,
        true,
        102.69845213765166,
        74.73651640564884,
            false,
            101.30132204402037,
            75.9826898971197,
            true,
            99.97004287363984,
            77.31233258816522,
            false,
            98.70534536874715,
            78.72404930722185,
            true,
            97.50767816464695,
            80.21642083741233,
            false,
            96.37721659085517,
            81.78807098816043,
            true,
            95.31388917038271,
            83.43772239393346,
            false,
            94.31741629727725,
            85.16423743400863,
            true,
            93.38735516151685,
            86.96664325842697,
            false,
            92.52314561099524,
            88.84414204920051,
            true,
            91.72415288931796,
            90.79610905629963,
            false,
            90.98970464858472,
            92.82208159104623,
            true,
            90.31912098913863,
            94.92174217499722,
            false,
            89.71173734240408,
            97.09489864490382,
            true,
            89.16692073170732,
            99.34146341463415,
            false,
            88.68408034714176,
            101.66143345593075,
            true,
            88.2626735239344,
            104.05487198395362,
            false,
            87.90220819897368,
            106.52189236982183,
            true,
            87.60224280754105,
            109.06264446188321,
            false,
            87.36238442516039,
            111.67730326894498,
            true,
            87.18228579344847,
            114.36605982087032,
            false,
            87.06164171473168,
            117.1291139514319,
            true,
            87.00018516804018,
            119.96666872408933,
            false,
        ]);
    });
});