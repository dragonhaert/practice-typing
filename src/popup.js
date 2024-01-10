time = (new Date).getTime()
if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'arabic')
}

const getWord = async (index = -1) => {
    const lang = localStorage.getItem('lang')
    const url = chrome.runtime.getURL(`../resources/data/${lang}.txt`)
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
    const lang_url = chrome.runtime.getURL('../resources/languages.json')
    languages = await fetch(lang_url, { headers: { 'Content-Type': 'application/json' } })
        .then((res) => res.json())
        .then((languages) => {
            const lang_selecter = document.getElementById('lang')
            for (key in languages) {
                option = document.createElement('option')
                Object.assign(option, { id: `lang_${key}`, value: key, text: languages[key]['title'] })
                lang_selecter.appendChild(option)
                console.log(languages[key]['title'], languages[key]['file_path'])
            }
            return languages
        })

    const stored_lang = localStorage.getItem('lang')

    Object.assign(document.getElementById('input'), { lang: languages[stored_lang].code, dir: languages[stored_lang].direction })
    Object.assign(document.getElementById('target'), { lang: languages[stored_lang].code, dir: languages[stored_lang].direction })

    document.getElementById('input').focus()
    document.getElementById(`lang_${stored_lang}`).setAttribute('selected', 'selected')

    document.getElementById('input').addEventListener('keypress', (event) => {
        if ((event.key == ' ' || event.key == 'Enter') && document.getElementById('input').value == document.getElementById('target').value) {
            event.preventDefault()
            reset()
        }
    })

    document.getElementById('lang').addEventListener('change', (event) => {
        newlang = document.getElementById('lang').value
        localStorage.setItem('lang', newlang)
        location.reload()
    })

    await reset()
})
