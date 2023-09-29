import bigInt from "big-integer" 

// Função para verificar se um número é primo
function ehPrimo(num) {
    for(let i = 2; i < num; i++)
        if(num % i === 0) return false 
    return num > 1 
}

// Função para gerar um número primo aleatório entre min e max
function gerarPrimo(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min 
    while(!ehPrimo(num)) {
        num = Math.floor(Math.random() * (max - min + 1)) + min 
    }
    return num 
}

// Função para calcular o máximo divisor comum (mdc) de dois números
function mdc(a, b) {
    if (!b) return a 
    return mdc(b, a % b) 
}

// Função para calcular o inverso multiplicativo modular de a mod m
function calcInversoMod(a, m) {
    let m0 = m 
    let y = 0, x = 1 

    if (m == 1)
        return 0 

    while (a > 1) {
        let q = Math.floor(a / m) 
        let t = m 

        m = a % m 
        a = t 
        t = y 

        y = x - q * y 
        x = t 
    }

    if (x < 0)
        x += m0 

    return x 
}

// Função para gerar as chaves pública e privada
function gerarChaves() {
    // Dois números primos aleatórios
    let p = gerarPrimo(50000, 9999999) 
    let q = gerarPrimo(50000, 9999999) 

    // Produto dos primos
    let n = p * q 

    // totiente de n
    let phi = (p-1)*(q-1) 

    // Escolhe um número inteiro e tal que e seja coprimo com phi(n)
    let e = 10
    while (mdc(e, phi) != 1) {
        e++ 
    }

    // d deve satisfazer a condição (d*e) Mod phi(n) = 1
    let d = calcInversoMod(e, phi) 

    // Retorna as chaves
    return {
        publica: {e: e, n: n},
        privada: {d: d, n: n}
    } 
}

// Função para criptografar uma mensagem
export function criptografar(chavePublica, msg) {
    let caracteres = msg.split('').map(caracter => caracter.charCodeAt()) 
    let caracterCifrado = caracteres.map(caracter => bigInt(caracter).modPow(chavePublica.e, chavePublica.n)) 
    
    return caracterCifrado.join(' ') 
}

// Função para descriptografar uma mensagem
export function descriptografar(chavePrivada, msgEncriptada) {
    let caracterCifrado = msgEncriptada.split(' ') 
    
    let caracterDecifrado = caracterCifrado.map(caracter => bigInt(caracter).modPow(chavePrivada.d, chavePrivada.n)) 
    
    return String.fromCharCode(...caracterDecifrado) 
}

let chaves = gerarChaves() 
let mensagem = "Hoje é segunda feira, dia de trabalhar graças a Deus!"
let mensagemEncriptada = criptografar(chaves.publica, mensagem) 
let mensagemDecriptada = descriptografar(chaves.privada, mensagemEncriptada) 

console.log("Mensagem original:", mensagem) 
console.log("Mensagem criptografada:", mensagemEncriptada) 
console.log("Mensagem descriptografada:", mensagemDecriptada) 