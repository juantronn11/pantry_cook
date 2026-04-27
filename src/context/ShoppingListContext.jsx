import { createContext, useContext, useState, useEffect } from 'react'
import { mergeIngredients } from '../utils/mergeIngredients'
import { useApi } from '../helperFunctions/helper'
import { useAuth0 } from '@auth0/auth0-react'

const ShoppingListContext = createContext(null)

export function ShoppingListProvider({ children }) {
    const [shoppingList, setShoppingList] = useState([])
    const [loaded, setLoaded] = useState(false)
    const { getShoppingList, saveShoppingList } = useApi()
    const { isAuthenticated , isLoading} = useAuth0()

    // TODO: direct navigation to /shopping-list on fresh load causes UnauthorizedError
    // Auth0 token not ready before getShoppingList fires — needs further investigation

    useEffect(() => {
        if (isLoading || !isAuthenticated) return
        getShoppingList()
            .then(data => {
                setShoppingList(data)
                setLoaded(true)
            }).catch(e => console.error('getShoppingList failed:', e))
    }, [isAuthenticated, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isLoading || !isAuthenticated || !loaded) return;

        saveShoppingList(shoppingList).catch(e => console.error('getShoppingList failed:', e))
    }, [shoppingList, isAuthenticated, loaded, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

    function addToShoppingList(recipe) {
        const newIngredients = recipe.raw?.extendedIngredients || []
        if (newIngredients.length === 0) return
        setShoppingList(prev => mergeIngredients(prev, newIngredients))
    }

    function addCustomItem(name) {
        const newItem = {
            id: Date.now(),
            name: name.trim(),
            amount: 0,
            unit: '',
            checked: false,
        }
        setShoppingList(prev => [...prev, newItem])
    }

    function removeFromShoppingList(itemId) {
        setShoppingList(prev => prev.filter(item => item.id !== itemId))
    }

    function toggleShoppingListItem(itemId) {
        setShoppingList(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        )
    }

    function clearShoppingList() {
        setShoppingList([])
    }

    const value = {
        shoppingList,
        addToShoppingList,
        addCustomItem,
        removeFromShoppingList,
        toggleShoppingListItem,
        clearShoppingList,
    }

    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    )
}

export function useShoppingListContext() {
    const context = useContext(ShoppingListContext)
    if (!context) {
        throw new Error('useShoppingListContext must be used within a ShoppingListProvider')
    }
    return context
}