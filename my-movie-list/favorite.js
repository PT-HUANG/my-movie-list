const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')
const favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []

//渲染電影資料
function renderMovies (data) {
	let rawHTML = ''
	data.forEach(item => {
		rawHTML += `
			<div class="col-sm-2 mt-3">
	          <div class="mb-2">
	            <div class="card">
	              <img
	                src="${POSTER_URL + item.image}"
	                class="card-img-top"
	                alt="Movie Poster"
	              />
	              <div class="card-body">
	                <h5 class="card-title">${item.title}</h5>
	              </div>
	              <div class="card-footer">
	                <button class="btn btn-primary btn-show-movie" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#movie-modal">More</button>
	                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
	              </div>
	            </div>
	          </div>
	        </div>
		`
	})
	dataPanel.innerHTML = rawHTML
}

renderMovies(favoriteList)

//事件監聽，點擊More後顯示電影資訊，點擊X後移除電影資料
dataPanel.addEventListener('click', function (e) {
	if (e.target.matches('.btn-show-movie')) {
		id = e.target.dataset.id
		showModal(id)
	}
	if (e.target.matches('.btn-remove-favorite')) {
		id = e.target.dataset.id
		removeFavoriteMovie(id)
	}
})


//顯示特定電影資訊 showModal function
function showModal (id) {
	const modalTitle = document.querySelector('#movie-modal-title')
	const modalImage = document.querySelector('#movie-modal-image')
	const modalDate = document.querySelector('#movie-modal-date')
	const modalDescription = document.querySelector('#movie-modal-description')
	let movie = favoriteList.find(item => item.id === Number(id))
  modalTitle.innerText = movie.title
  modalDate.innerText = 'Release date: ' + movie.release_date
  modalDescription.innerText = movie.description
  modalImage.innerHTML = `<img src="${POSTER_URL + movie.image}" alt="movie-poster" class="img-fluid">`
}


//移除我的最愛電影
function removeFavoriteMovie (id) {
	if (!favoriteList || !favoriteList.length) return //錯誤處理，避免未來寫code的時候產生bug

	const movieIndex = favoriteList.findIndex(movie => movie.id === Number(id)) //找到favoritelist裡面id的index
	if(movieIndex === -1) return //錯誤處理

	favoriteList.splice(movieIndex, 1)
	localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList))
	renderMovies(favoriteList)
}

