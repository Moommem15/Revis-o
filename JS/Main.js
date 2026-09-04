const Modal = document.getElementById("Modal")
const FormContato = document.getElementById("FormContato")
const Filtros = document.getElementById("Filtros")
const ListaLivros = document.getElementById("ListaLivros")
let livros
let categorias
async function PegarDados() {
    livros = await fetch("/livros")
    livros = await livros.json()
    categorias = await fetch("/categorias")
    categorias = await categorias.json()
    CriarFiltro()
    MostrarGaleria(0)
}
PegarDados()

function CriarFiltro() {
    console.log(categorias);
    
    categorias.forEach(element => {
        Filtros.innerHTML += ` <button onclick='MostrarGaleria(${element.id})'>${element.materia}</button>`
    });
}
function MostrarGaleria(IdCategoria)
{
    ListaLivros.innerHTML = ''
    if(IdCategoria == 0)
    {
        livros.forEach(element=>{
            ListaLivros.innerHTML += ` <div class="Card">
                <div class="ImgCard">
                    <img src="${element.imagem}" alt="">
                </div>
                <div class="TextoCard">
                    <span>${element.titulo}</span>
                     <div class="Detalhe">
                        <span>Autor: ${element.autor}</span>
                        <span>Ano Edicão:  ${element.anoEdicao}</span>
                        <span>Disponivel: ${element.disponivel? "Sim":"Não"}</span>
                    </div>

                </div>
            </div>`
        })
    }else{
        for (let index = 0; index < livros.length; index++) {
            const element = livros[index];
            console.log(element);
            
            if(element.categoria_id == IdCategoria)
            {
                 ListaLivros.innerHTML += ` <div class="Card">
                <div class="ImgCard">
                    <img src="${element.imagem}" alt="">
                </div>
                <div class="TextoCard">
                    <span>${element.titulo}</span>
                     <div class="Detalhe">
                        <span>Autor: ${element.autor}</span>
                        <span>Ano Edicão:  ${element.anoEdicao}</span>
                        <span>Disponivel: ${element.disponivel? "Sim":"Não"}</span>
                    </div>

                </div>
            </div>`
            }
        }
    }
}

function AbrirForm() {
    Modal.style.display = 'flex'
    FormContato.style.display = 'flex'
}
function FecharForm() {
    Modal.style.display = 'none'
    FormContato.style.display = 'none'
}