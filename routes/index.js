const express = require('express')
const fs = require('fs')
const path = require('path')

const DOGS_DATA_FILE = path.join(__dirname, '../data/dogs.json')
const FAVS_DATA_FILE = path.join(__dirname, '../data/favs.json')

const router = express.Router()

// Returns all dog breeds in the database
const getAllBreeds = async (req, res, next) => {
	try {
		const data = fs.readFileSync(DOGS_DATA_FILE, 'utf8')
		const breeds = data && JSON.parse(data)

		if (!breeds || breeds.length === 0) {
			const err = new Error('No breeds found')
			err.status = 404
			throw err
		}

		res.json(breeds)
	} catch (e) {
		next(e)
	}
}

router.route('/breeds').get(getAllBreeds)

// Returns breed based on ID
const getBreedById = async (req, res, next) => {
	try {
		const data = fs.readFileSync(DOGS_DATA_FILE, 'utf8')
		const breeds = (data && JSON.parse(data)) || []
		const breed = breeds.find((b) => b.id === Number(req.params.id))

		if (!breed) {
			const err = new Error('Breed not found')
			err.status = 404
			throw err
		}
		res.json(breed)
	} catch (e) {
		next(e)
	}
}

router.route('/breeds/:id').get(getBreedById)

// Returns all favorite breeds
const getAllFavorites = async (req, res, next) => {
	try {
		const data = fs.readFileSync(FAVS_DATA_FILE, 'utf8')
		const favorites = (data && JSON.parse(data)) || []

		// Expand favrites indexes to include indicated breed
		const dog_data = fs.readFileSync(DOGS_DATA_FILE, 'utf8')
		const breeds = (data && JSON.parse(dog_data)) || []

		const expandedFavorites = favorites.map((f) => {
			const breed = breeds.find((b) => b.id === f.breed_id)
			return {
				id: f.id,
				breed: breed,
			}
		})
		res.json(expandedFavorites)
	} catch (e) {
		next(e)
	}
}

router.route('/favorites').get(getAllFavorites)

// Returns favorite breed based on favorite ID
const getFavoriteById = async (req, res, next) => {
	try {
		const fav_data = fs.readFileSync(FAVS_DATA_FILE, 'utf8')
		const favorites = fav_data && JSON.parse(fav_data)

		if (!favorites || favorites.length === 0) {
			const err = new Error('No favorite breed found')
			err.status = 404
			throw err
		}

		const favorite = favorites.find((f) => f.id === Number(req.params.id))

		if (!favorite) {
			const err = new Error('Favorite not found')
			err.status = 404
			throw err
		}

		const dog_data = fs.readFileSync(DOGS_DATA_FILE, 'utf8')
		const breeds = dog_data && JSON.parse(dog_data)

		// favorites is just an index at this point
		// and needs content expanded with the breed
		const breed = breeds.find((b) => b.id === favorite.breed_id)

		if (!breed) {
			const err = new Error('Favorite breed not found')
			err.status = 404
			throw err
		}

		const expandedFavorite = {
			id: favorite.id,
			breed: breed,
		}

		res.json(expandedFavorite)
	} catch (e) {
		next(e)
	}
}

router.route('/favorites/:id').get(getFavoriteById)

// Adds a breed to the list of favorites
const addToFavorites = async (req, res, next) => {
	try {
		// simple validate breed_id on request body
		if (!req.body || !req.body.breed_id) {
			const err = new Error('Bad request')
			err.status = 400
			throw err
		}

		const fav_data = fs.readFileSync(FAVS_DATA_FILE, 'utf8')
		const favorites = fav_data && JSON.parse(fav_data)

		const dog_data = fs.readFileSync(DOGS_DATA_FILE, 'utf8')
		const breeds = (dog_data && JSON.parse(dog_data)) || []
		const breed = breeds.find((b) => b.id === Number(req.body.breed_id))

		if (!breed) {
			const err = new Error('Breed not found')
			err.status = 404
			throw err
		}

		const alreadyFavorite = favorites.find((f) => f.breed_id === breed.id)
		const maxId = favorites.reduce((id, f) => Math.max(id, f.id), 0)

		if (!alreadyFavorite) {
			const newFavorite = {
				id: maxId + 1,
				breed_id: breed.id,
			}

			favorites.push(newFavorite)
			fs.writeFileSync(FAVS_DATA_FILE, JSON.stringify(favorites))
		}

		res.status(204).end()
	} catch (e) {
		next(e)
	}
}

router.route('/favorites/add/').post(addToFavorites)

// Removes a breed from the list of favorites
const deleteFavorite = async (req, res, next) => {
	try {
		const data = fs.readFileSync(FAVS_DATA_FILE, 'utf8')
		const favorites = (data && JSON.parse(data)) || []
		const favorite = favorites.find((f) => f.id === Number(req.params.id))

		// remove from favorites if found
		if (favorite) {
			const newFavs = favorites
				.map((f) => {
					if (f.id === favorite.id) {
						return null
					} else {
						return f
					}
				})
				.filter((f) => f !== null)

			fs.writeFileSync(FAVS_DATA_FILE, JSON.stringify(newFavs))
		}

		// idempotent deletes - no error if not found
		res.status(200).end()
	} catch (e) {
		next(e)
	}
}

router.route('/favorites/:id').delete(deleteFavorite)

module.exports = router
