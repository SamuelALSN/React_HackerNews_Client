 const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    const { searchKey, results } = prevState
    const oldHits = results && results[searchKey]
        ? results[searchKey].hits
        : []

    const updatedHits = [
        ...oldHits,
        ...hits
    ]
    // returning our previous state 
    return {
        results: {
            ...results,
            [searchKey]: { hits: updatedHits, page }
        },
        isLoading: false
    }
}

export default updateSearchTopStoriesState