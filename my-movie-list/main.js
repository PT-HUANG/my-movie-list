const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const moviesPerPage = 12

let movies = []
let filteredMovies = []
let currentPage = 1

const dataPanel = document.querySelector('#data-panel')
const movieModal = document.querySelector('#movie-modal')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const displayButton = document.querySelector('.display-button')
const displayModes = Array.from(displayButton.children) 


//利用axios(JS函式庫，向第三方請求API)
axios
	.get(INDEX_URL)
  .then(response => {
    movies.push(...response.data.results)
    renderMovies(getMoviesByPage(1)) //預設為第一頁的內容
    renderPaginator(movies)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })


//渲染電影資料
function renderMovies (data) {
	const Currentmode = displayModes.find(element => element.classList.contains('CurrentDisplayMode'))
	const displayMode = Currentmode.dataset.mode
	switch (displayMode) {
		case 'card':
			renderMoviesByCard(data)
			break;
		case 'list':
			renderMoviesByList(data)
			break;
	}
}

//顯示清單模式
function renderMoviesByList (data) {
	let rawHTML = `<ul class="list-group col-8 my-3">`
	data.forEach(item => {
		rawHTML += `
			<li class="list-group-item d-flex align-items-center justify-content-between">
				<div>
          <p class="mt-3">${item.title}</p>	
        </div>
        <div>
          <button class="btn btn-primary btn-show-movie" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#movie-modal">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
			</li>
		`
	})
	rawHTML += `</ul>`
	dataPanel.innerHTML = rawHTML
}

//顯示卡片模式
function renderMoviesByCard (data) {
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
	                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
	              </div>
	            </div>
	          </div>
	        </div>
		`
	})
	dataPanel.innerHTML = rawHTML
}

//根據不同分頁顯示電影資料
function getMoviesByPage (page) {
	const data = filteredMovies.length ? filteredMovies : movies
	const startIndex = (page - 1) * moviesPerPage
	return data.slice(startIndex, startIndex + moviesPerPage)
}

//顯示所有分頁按鈕
function renderPaginator(movies) {
	let rawHTML = ''
	const endPage = Math.ceil(movies.length/moviesPerPage)
	for (let page = 1; page <= endPage; page++) {
		rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
	}
	paginator.innerHTML = rawHTML
}

//分頁點擊事件，點擊後切換分頁，顯示指定的分頁內容
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return  //如果被點擊的不是 a 標籤，結束
  const page = Number(event.target.dataset.page) //透過 dataset 取得被點擊的頁數
	currentPage = page
  renderMovies(getMoviesByPage(page)) //點擊後更新畫面
})


//搜尋功能，搜尋後重新render畫面、重新render paginator
searchForm.addEventListener('submit', function onsearchFormSubmitted (e) {
	e.preventDefault()
	const keyword = searchInput.value.trim().toLowerCase()

	//方法：Array.filter
	filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

	if (filteredMovies.length === 0) {
		alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
		renderMovies(getMoviesByPage(1))
  	renderPaginator(movies)
    return
  }
  renderMovies(getMoviesByPage(1))
  renderPaginator(filteredMovies)
})


//建立事件監聽+事件代理，顯示特定電影資訊modal、加入收藏清單
dataPanel.addEventListener('click', function onPanelClicked (e) {
	if (e.target.matches('.btn-show-movie')) {
		showModal(e.target.dataset.id)
	} else if (e.target.matches('.btn-add-favorite')) {
		addFavorite(e.target.dataset.id)
	}
})


//顯示特定電影資訊 showModal function
function showModal (id) {
	const modalTitle = document.querySelector('#movie-modal-title')
	const modalImage = document.querySelector('#movie-modal-image')
	const modalDate = document.querySelector('#movie-modal-date')
	const modalDescription = document.querySelector('#movie-modal-description')
	axios.get(INDEX_URL + id)
	  .then(response => {
	  	const data = response.data.results
	    modalTitle.innerText = data.title
	    modalDate.innerText = 'Release date: ' + data.release_date
	    modalDescription.innerText = data.description
	    modalImage.innerHTML = `<img src="${
	      POSTER_URL + data.image
	    }" alt="movie-poster" class="img-fluid">`
	  })
	  .catch(function (error) {
	    // handle error
	    console.log(error);
	  })
}

//加入收藏清單function
function addFavorite(id) {
	const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //如果左邊為undefined，則設定為空陣列
	const movie = movies.find((movie) => movie.id === Number(id)) //尋找movies裡面的每一個movie元素，如果id沒重複的話push進去list陣列
	if (list.some((item) => item.id === movie.id)) { 
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list)) //重新設定localstorage => key:value = favoriteMovies: JSON(list)
}

//顯示模式切換
displayButton.addEventListener('click', e => { 
	displayModes.forEach(element => element.classList.remove('CurrentDisplayMode'))
	e.target.classList.add('CurrentDisplayMode')
	renderMovies(getMoviesByPage(currentPage))
	renderPaginator(filteredMovies.length ? filteredMovies : movies)
})


/*
加碼功能：切換顯示模式

完成功能：

	第一階段：點擊 list 按鈕時會出現列表模式 v
	第二階段：可以切換 list 模式和 card 模式 v
	第三階段：切換顯示模式時，維持現有分頁 v

邏輯思路：

	(1) HTML內新增兩個顯示模式切換的icon(Font Awesome)

	(2) 建立一個變數 displayModes 放入所有的子元素(icons) 

	(3) 在父元素建立事件監聽，利用class來決定點擊後要顯示的模式(切換flag)
			=> 移除所有子元素的 class 'CurrentDisplayMode' 
			=> 再將 e.target 新增 class 'CurrentDisplayMode'
			=> 呼叫 renderMovies、renderPaginator 重新渲染畫面

	(4) renderMovies 函式修改
			=> 找到當前擁有"CurrentDisplayMode" 這個class的元素
			=> 接著利用HTML內事先設定好的data-mode，利用dataset獲取要顯示的模式
			=> flow control:利用siwtch case, 呼叫不同顯示模式的函式 renderMoviesByCard、 renderMoviesByList

	(5) 新增 renderMoviesByList 函式，呼叫後可以用清單顯示電影資料

	(6) 建立一個變數 currentPage，預設為1, 每次點擊Paginator的時候紀錄當前頁面
			const page = Number(event.target.dataset.page) //透過 dataset 取得被點擊的頁數
			currentPage = page
			如此一來，就能在切換模式的時候維持當前頁面
*/