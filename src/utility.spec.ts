import * as assert from 'assert'

import redis from './redis_client'
import word2vec from './utility'

function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

describe('Test', async function () {
    this.slow(5000)
    this.timeout(10000)
    const answer = '-0.467137,-0.736175,-0.47084,-0.121467,0.046195,-0.409322,0.313366,0.120663,-0.663198,0.264323,0.344812,0.375084,-0.323942,0.508163,-0.251123,-0.512133,0.116466,-0.343597,0.442621,-0.410474,-0.0446139,-0.134052,0.114174,0.117004,-0.355013,0.358559,-0.419677,0.394436,-0.226462,0.0961731,0.230038,-0.0396518,-0.778475,-0.264589,-0.349708,-0.246114,-0.0458741,-0.192407,0.768454,0.278782,-0.223035,-0.220442,-0.183654,-0.0430379,0.170129,-0.644578,0.514739,-0.415638,0.0938374,-0.116832,-0.832373,0.52987,-0.0784958,-0.132563,-0.764413,-0.511481,0.676884,0.732095,-0.165276,0.792748,-0.329748,-0.314537,0.158361,0.0581374,-0.168203,-0.190177,-0.0130961,-0.157613,0.485257,-0.215729,0.103986,-0.400681,-0.650635,0.52219,0.0748571,-0.426764,-0.821523,0.218813,0.128606,-0.215483,0.0326082,0.147229,-0.0801621,-0.196426,-0.065447,-0.133496,0.613257,-0.00318369,0.304982,-0.596719,0.437744,-0.0060771,-0.0109566,-0.0629331,-0.0248503,0.0238653,0.516456,0.0262146,0.48573,0.790271,0.403682,-0.339882,-0.505979,-0.230515,0.0919635,-0.0960397,0.668517,0.167528,0.775389,0.268066,-0.379527,-0.147135,0.208232,0.0408794,0.0846964,-0.0184869,-0.333233,0.0378195,0.50486,-0.416858,0.724875,-0.130287,0.0405815,-0.365525,-0.060023,0.166171,-0.309425,-0.000846676,-0.175616,-0.1005,0.0265383,-0.873494,0.111918,-0.540755,0.250067,-0.44216,-0.770741,0.265101,0.204811,-0.366402,0.00117223,-0.392024,-0.435507,0.463464,0.260227,-0.605298,-0.0890678,-0.299952,0.286511,0.341157,-0.0352542,0.198346,-0.0772171,-0.121561,-0.516604,-0.39383,0.240003,0.00831427,-0.319211,0.0994825,-0.275391,0.250138,0.518333,-0.294718,-0.149824,-0.329663,-0.264339,-0.102855,0.60928,-0.703354,-0.168074,-0.317825,0.287773,0.510714,0.656689,-0.703125,0.179127,-0.293667,0.49929,0.208389,0.393783,-0.519879,-0.757652,0.0731238,-0.18152,0.858893,0.295226,-0.394157,0.219427,-0.453436,0.527934,0.312541,0.00922522,0.665471,0.254133,-0.514896,0.343618,-0.709909,-0.0162237,-0.85045,0.184271,0.784903,0.151932,0.0836653,-0.487583,-0.298297,0.131033,-0.241635,-0.262839,-0.444741,0.369686,-0.440938,0.557843,0.219956,-0.805049,0.27061,0.333608,0.27601,-0.142351,-0.690456,0.100912,0.604495,0.246178,0.139014,0.114432,-0.384437,0.0113476,0.00728748,-0.0605623,0.0836316,0.141585,-0.610556,0.202685,-0.690832,0.494153,-0.303251,-0.141628,-0.613344,0.46248,0.0752948,0.150046,0.109147,-0.827734,-0.274967,-0.136174,0.0522482,-0.0928483,0.391479,-0.561285,0.173447,-0.146765,-0.190545,0.149063,-0.0304318,-0.200485,-0.0446942,-0.189315,-0.505627,0.129266,-0.388303,-0.172979,0.544786,-0.254856,-0.519485,0.477714,0.766139,0.4858,0.133187,-0.331146,-0.352971,0.169632,0.168736,-0.240627,-0.558313,0.143608,1.09192,-0.371284,-0.115129,0.149324,-0.0526889,0.124073,0.484501,-0.44746,-0.00622895,0.660742,-0.373985,-0.225512,-0.159682,0.251268,0.0634197,0.357593,-0.403959,-0.517372,0.250408,-0.529065,0.342722,-0.0496902,-0.707714,0.224906,-0.221558,-0.1008,0.209961,-0.478974,-0.0467657,0.047976,-0.523747,0.176594,0.529644,0.146307,-0.360436,0.120302,-0.457535,0.1603,0.33364,-0.287484,-0.254113,0.176886,-0.244223,-0.172685,-0.134879,-0.0704801,0.510527,0.196031,-0.523665,0.317097,-0.0478018,-0.149903,0.290986,-0.579837,0.599495,0.344832,-0.058585,-0.0790498,-0.256004,-0.256407,0.417118,-0.628874,0.0257183,-0.442135,-0.266669,0.592165,-0.26019,-0.68249,0.728455,0.527869,-0.30665,-0.39615,0.179041,-1.06295,0.00478897,0.406275,0.670894,0.26511,0.0983921,0.396814,-0.285842,-0.360633,-0.340196,0.431055,0.164094,-0.0565785,-0.857337,0.4743,0.0197635,-0.522112,1.00587,0.574472,0.223857,0.376728,0.848117,0.0688374,-0.0397001,0.0687912,0.171092,0.0868937,0.470439,0.189533,-0.504901,-0.601404,-0.218228,-0.31273,-0.273257,0.10169,-0.562332,-0.351995,-0.0536331,-0.555296,0.0975057,0.101023,-0.483622,0.0170099,0.228049,0.110303,0.734583,-0.35543,-0.244832,0.0894378,0.0937451,0.237939,-0.206607,0.810135,-0.344851,0.81211,0.772153,0.167755,0.0248619,-0.138301,0.253176,0.657493,0.669267,-0.819466,-0.240369,-0.235557,-0.355468,-0.325515,-0.206812,-0.271105,-0.513339,-0.167838,-0.244703,-0.0264963,0.377147,0.0780759,0.0934979,0.04178,0.127052,0.17354,0.517228,-0.118783,0.557682,0.291171,1.10178,0.336728,0.177237,0.10334,-0.215481,0.72596,-0.796391,-0.123647,-0.386831,0.423532,1.34909,0.869145,0.00539648,-0.616024,0.688866,0.105374,0.312947,-0.339335,0.838148,-0.252061,-0.930225,0.152988,0.0879559,0.190392,0.84179,-0.557194,-0.0876814,0.12223,0.465267,-0.157807,-0.434048,0.531407,0.473302,0.287456,0.377992,0.839114,0.0833454,-0.146509,0.0398724,0.0708973,-0.304491,0.864967,-0.18027,0.661258,0.917735,-0.0729767,0.319121,0.688691,-0.235872,0.114969,-0.0528752,0.0640036,-0.0888621,-0.635221,0.825243,0.0306486,-0.335242,-0.655257,-0.632016,-0.130041,0.180854,0.572275,-0.199686,-0.269083,-0.567301,-0.14129,0.449962,-0.165131,0.457169,0.154938,-0.379363,-0.52235,0.188044,-0.422887,0.585726,-0.829341,0.240747,-0.0555704,0.0194935,-0.0563575,-0.102652,0.296337,0.107552,-0.212878,-0.152188,-0.320743,-0.274306,-0.200479,0.19596,0.624836,-0.0372239,-0.0898315,0.292104,0.53328,-0.299472,-0.145325,-0.196837,-0.884114,-0.432728,0.354273,0.391199,-0.502796,0.598719,-0.435793,0.369473,0.398808,-0.687863,0.310485,-0.179625,-0.213905,0.0596699,0.26774,-0.292745,0.627041,0.2944,-0.25336,-0.531181,-0.0141183,-0.520709,-0.538802,0.436013,0.0706185,0.0111818,0.211575,0.618321,0.0044281,0.556311,-0.343552,-0.0617547,0.0103065,0.130077,0.0122717,-0.110715,-0.583871,0.107606,-0.0140067,0.166103,-0.396529,0.0434502,0.186711,0.293294,-0.384283,0.561115,-0.250392,-0.08715,0.713398,-0.128372,-0.219519,-0.135436,-0.651615,-0.550834,0.353716,0.612883,0.177514,-0.130367,0.162342,0.634673,0.0995467,-0.68009,-0.00192269,0.215737,-0.11779,0.139101,-0.389456,-0.0429829,0.588205,0.0830336,-0.570298,-0.477547,-0.364224,-0.0303651,-0.600847,-0.0804373,0.344472,-0.0804178,0.326423,0.310573,-0.57899,-1.04923,0.0679001,-0.0681602,-0.342687,-0.317384,-0.882459,-0.352902,0.0745588,0.204588,0.333312,0.242041,-0.182801,-0.233429,-0.0771953,0.388018,-0.0281879,-0.099505,-0.788242,-0.360961,0.732985,-0.921241,0.0512368,0.000108686,-0.297667,0.64375,0.0556629,0.583863,-0.738198,-0.083803,0.260675,0.223534,-0.483907,0.257902,-0.525628,0.0659816,0.803707,0.345468,0.576161,-0.999809,-0.377128,-0.428334,0.564316,-0.272756,-0.570233,-0.409937,-0.390786,-0.423995,0.384537,0.169902,-0.533965,0.519041,-0.146457,0.310872,0.00973865,0.424541,-0.458266,0.0484368,-0.13577,0.181696,-0.0126607,0.39995,-0.0949732,0.695762,0.286124,-0.057033,-0.251314,0.633998,0.270752,-0.0861879,0.227905,-0.913906,-0.719177,0.661099,-0.247215,-0.0211579,0.594175,-0.084514,0.0689977,0.067539,-0.273544,-0.948191,-0.655444,0.24224,0.539893,-0.867686,-0.131155,0.189967,0.39458,-0.259827,0.499132,-0.329546,0.0202402,-0.0656562,-0.41545,-0.527332,-0.179442,0.0626368,-0.411588,0.450448,-0.363952,0.642071,0.145985,0.648565,-0.00286868,-0.560704,-0.204207,-0.167693,0.0419482,-0.3966,0.22369,0.580901,-0.100671,-0.0000357158,-0.299948,0.729551,-0.0809949,0.172283,0.343568,0.728787,0.485526,-0.154991,-0.378125,0.128166,-0.879828,-0.42647,-0.718496,0.100551,0.547628,-0.127263,-0.257227,0.20934,0.0189494,0.130571,-0.363539,-0.111836,0.536705,0.54476,0.182919,-0.438004,-0.328482,-0.23308,-0.120678,-1.04769,-0.213243,-0.570502,0.315057,-0.108064,0.440366,-1.08709,0.452968,0.419271,-0.232735,0.274741,-0.127334,0.902248,-0.189936,0.51526,-0.495871,-0.0398069,-0.200253,-0.0428309,0.322801,-0.19994,-0.446463,-0.756704,-0.594658,0.577319,-0.718565,0.180805,0.185544,-0.0711863,0.473328,-0.081739,0.0927495,-0.00708896,-0.377959,0.3053,-1.00056,0.537419,0.525859,0.628793,0.106502,0.501877,0.294379,0.672325,-0.39743,-0.285426,-0.0528485,0.311526,-0.158796,-0.375665,-0.25993,-0.272485,1.13459,-0.58867,-0.564322,-0.114929,0.253175,-0.0571499,0.211264,0.577512,-0.210395,0.472778,0.528786,-0.142926,0.127358,-0.730976,-0.253024,0.263241,-0.351478,-0.186397,-0.0876938,-0.853093,-0.215254,0.275795,0.168643,0.26394,0.18451,0.129095,0.675341,0.352563,0.169716,0.385901,0.555012,0.555411,0.0975901,0.0375291,-0.993838,-0.121961,-0.601748,0.275826,0.159248,-0.13361,0.455071,0.168032,0.861791,-0.154978,0.332311,0.894402,-0.457928,0.206325,0.0641321,-0.0438133,0.501323,0.0346463,-0.677936,0.118754,0.056042,0.0860687,0.473456,-0.41533,0.202527,-0.137997,0.46492,-0.298968,0.146868,0.00768891,-0.188275,-0.0806075,0.0462128,0.219124,-0.0240103,-0.00142436,-0.141677,0.138609,0.23231,-0.38921,-0.525468,-0.122894,0.201587,-0.0590515,0.0494771,-0.650928,0.397819,-0.493137,0.230458,0.447211,0.198843,0.174071,0.373559,0.372382,0.649189,-0.0362917,-0.498848,0.447097,-0.101375,0.331647,0.256345,-0.551007,-0.0147256,-0.154644,0.58713,0.0212077,0.105056,0.277857,0.361334,0.566182,-0.140281,0.0984532,-0.0632244,-0.315279,0.0192342,0.321947,-0.272802,1.04122,-0.368626,0.509137,-0.433319,0.303714,-0.0852357,0.585557,0.0908076,0.315574,-0.392899,-0.354777,0.0613147,0.108899,0.45296,-0.289214,0.220582,-0.346375,-0.466048,0.119905,0.133298,-0.0768603,0.0623625,-0.191299,0.163967,0.655724,0.166452,-0.280633,0.785245,0.0960775,-0.229065,0.453128,0.478922,-0.0103815,0.250196,0.207492,-0.293052,0.291478,-0.263528,-0.58771,-0.618217,-0.127083,0.0298109,-0.186434,0.702109,0.193683,-0.280378,-0.163581,-0.383386,0.248089,-0.356871,-0.2077,0.423538,0.200106,-0.920044,-0.710547,0.160304,0.0955117,-0.598109,-0.511999,0.0677053,-1.45839,0.504242,0.399105,-0.636036,0.185557,-0.374654,-1.05322,0.153125,0.15474,-0.256753,-0.295984,0.100415,0.458396,-0.311402,0.301272,-0.093952,0.163496,-0.211768,0.184806,-0.245118,0.050413,0.118833,0.197346,0.0585337,0.771322,-0.0827289,0.451077,0.482514,0.622744,-0.177266,-0.596978,0.325967,-0.878672,0.166643,-0.078068,0.0428766,-0.278508,-0.157713,-0.565312,-0.15055,-0.0661615,0.266714,0.269894,-0.0946463,0.14067,-0.0304778,-0.051182,0.405212,0.515035,-0.150461,-0.0165134'

    // it('Return none if it does not exist in redis', async function () {
    //     const text = '王'
    //     await word2vec(redis, text)
    // })

    it('Return if it exists in redis', async function () {
        await redis.flushall()
        await redis.set('王', [0.233962, 0.336867].toString())
        const result = await word2vec(redis, '王')
        assert.equal(result.get(), '0.233962,0.336867')
    })

    it('Return if it exists in aip', async function () {
        await redis.flushall()
        const result = await word2vec(redis, '王')
        assert.equal(result.get(), answer)
    })

    it('Cache in redis if it does not exist in redis', async function () {
        await redis.flushall()
        await word2vec(redis, '王')
        await sleep(50)
        const result = await redis.get('王')
        assert.equal(result, answer)
    })
})