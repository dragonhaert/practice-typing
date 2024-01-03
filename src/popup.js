time = (new Date).getTime()
if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'arabic')
}

const getWord = async (index = -1) => {
    const lang = localStorage.getItem('lang')
    const url = chrome.runtime.getURL(`../resources/${lang}.txt`)
    const words = await fetch(url, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
        .then((res) => res.text())
        .then((text) => text.split('\n'))
    console.log(words.length)
    return index == -1 ? words[Math.floor(Math.random() * words.length)] : words[index]
}
const reset = async () => {
    oldTime = time
    time = (new Date).getTime()
    timeDiff = time - oldTime
    word = await getWord()
    document.getElementById('kps').innerText = Math.floor((timeDiff / word.length)) / 1000
    document.getElementById('target').value = `${word}`
    document.getElementById('input').value = ''
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('input').focus()
    const lang = localStorage.getItem('lang')
    document.querySelector(`option[value=${lang}]`).setAttribute('selected','selected')
    await reset()

    document.getElementById('input').addEventListener('keypress', (event) => {
        if ((event.key == ' ' || event.key == 'Enter') && document.getElementById('input').value == document.getElementById('target').value) {
            event.preventDefault()
            reset()
        }
    })

    document.getElementById('lang').addEventListener('change', (event) =>{
        console.log('selection made')
        newlang = document.getElementById('lang').value
        localStorage.setItem('lang', newlang)
        location.reload()
    })
})
