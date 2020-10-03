export class TOOL {

	// FUNCTIONS
	createEl = (obj) => {
		let {
			el: elem,
			classname,
			id,
			content,
			type,
			append,
			style,
			data,
			value
		} = obj
		let el = document.createElement(elem)
		this.addValue(el, value)
		this.addType(el, type)
		this.addContent(el, content)
		this.addId(el, id)
		this.addClass(el, classname)
		this.css(el, style)
		this.setData(el, data)
		this.append(el, append)

		return el
	}
	createImg = (obj) => {
		let {
			src,
			id,
			classname,
			style,
			data,
			attr
		} = obj
		let img = new Image(),
			key, val, res = ''
		src != undefined ? img.src = src : false
		classname != undefined ? img.setAttribute('class', classname) : false
		id != undefined ? img.setAttribute('id', id) : false

		if (style) {
			Object.entries(style).forEach(pair => {
				key = pair[0], val = pair[1]
				res += `${key}:${val};`
			});

			img.setAttribute('style', res)
			res = ''
		}
		if (data) {
			if (typeof data == 'object') {
				Object.entries(data).forEach(pair => {
					key = pair[0], val = pair[1]

					img.setAttribute(`data-${key}`, val)
				})
			}
		}
		if (attr) {
			if (typeof attr == 'object') {
				Object.entries(attr).forEach(pair => {
					key = pair[0], val = pair[1]

					img.setAttribute(key, val)
				})
			} else if (typeof attr == 'string') {
				attr = attr.split(':')
				key = attr[0], val = attr[1]

				img.setAttribute(key, val)
			}
		}

		return img
	}
	isHidden = (el) => {
		return (el.offsetParent === null)
	}
	addClass = (el, classname) => {
		if (typeof classname == 'object') {
			classname.forEach(Newclassname => {
				el.classList.add(Newclassname)
			})
		} else {
			classname != undefined ? el.setAttribute('class', classname) : false
		}
	}
	addId = (el, id) => {
		id != undefined ? el.setAttribute('id', id) : typeof id == 'object' ? console.log('Id should not be an Object') : false
	}
	addContent = (el, content) => {
		content != undefined ? el.innerHTML = content : false
	}
	addValue = (el, value) => {
		value != undefined ? el.value = value : false
	}
	addType = (el, type) => {
		type != undefined ? el.setAttribute('type', type) : false
	}
	append = (el, append) => {
		if (typeof append == 'object' && append.length != undefined) {
			for (let i = 0; i < append.length; i++) {
				el.appendChild(append[i])
			}
		} else {
			append != undefined ? el.appendChild(append) : false
		}
	}
	setData = (el, data) => {
		let key, val
		if (data) {
			if (typeof data == 'object') {
				Object.entries(data).forEach(pair => {
					key = pair[0], val = pair[1]

					el.setAttribute(`data-${key}`, val)
				})
			}
		}
	}
	css = (el, style) => {
		let key, val, res = ''
		if (typeof el == 'string') {
			el = this.getElem(el)
		}
		if (style) {
			try {
				Object.entries(style).forEach(pair => {
					key = pair[0], val = pair[1]
					res += `${key}:${val};`
				});
				el.setAttribute('style', res)
				res = ''
			} catch (error) {
				try {
					res = ''
					Object.values(el).forEach(ElementOnList => {
						el = this.getElem(ElementOnList)
						res = ''
						if (el.length) {
							el.forEach(elem => {
								Object.entries(style).forEach(pair => {
									key = pair[0], val = pair[1]
									res += `${key}:${val};`
								});
								elem.setAttribute('style', res)
								res = ''
							})
						} else {
							Object.entries(style).forEach(pair => {
								key = pair[0], val = pair[1]
								res += `${key}:${val};`
							});
							el.setAttribute('style', res)
							res = ''
						}
					})

				} catch (error) {

				}
			}
		}
	}
	getElem = (el) => {

		if (typeof el == 'object') return el

		let List = el.split(' '),
			elemResult = {},
			element = '',
			result, child;
		if (el.indexOf(':') > -1) {

		}
		List.forEach(css => {
			elemResult[css] = css.includes('.') ? 'class' : css.includes('#') ? 'id' : 'tag'
		})
		Object.entries(elemResult).forEach(pair => {
			let val = pair[0];
			element += `${val} `;
		})

		result = document.querySelectorAll(element).length < 1 ? document.querySelector(element) : document.querySelectorAll(element)
		if (result != null) return result
	}
	selectElem = (el, callback) => {
		if (callback) {
			callback(this.getElem(el))
			return
		}
		return this.getElem(el)
	}
	html = (el, callback) => {
		let result, separator;

		el = this.getElem(el)

		if (el.length) {
			result = {}
			el.forEach((elem, index) => {
				callback ? typeof callback == 'string' ? elem.innerHTML = callback : false : false
				result[index] = {
					element: elem,
					html: elem.innerHTML.trim()
				}
			})
			callback ? typeof callback == 'function' ? callback(result) : false : false
		} else {
			result = el.innerHTML
			return !callback ? result : typeof callback == 'function' ? callback(result) : el.innerHTML = callback
		}
	}
	evtListener = (event, el, callback) => {
		el = this.getElem(el)

		el.addEventListener(event, function (evt) {
			callback ? callback(evt) : false
		})
	}
	controlArr(control, arr, currentIndex, index) {
		let result;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] == currentIndex) {
				switch (control) {
					case 'next':
						result = arr[i + 1]
						break;
					case 'prev':
						result = arr[i - 1]
						break;
					case 'plus':
						result = arr[i + index]
						break;
					case 'minus':
						result = arr[i - index]
						break;
				}
			}
		}
		return result
	}
	getNextInArrayValue(array, currentvalue) {
		let next;
		for (let i = 0; i < array.length; i++) {
			if (array[i] == currentvalue) {
				next = array[i + 1];
			}
		}
		return next;
	}
	getPrevInArrayValue(array, currentvalue) {
		let next;
		for (let i = 0; i < array.length; i++) {
			if (array[i] == currentvalue) {
				next = array[i - 1];
			}
		}
		return next;
	}
}