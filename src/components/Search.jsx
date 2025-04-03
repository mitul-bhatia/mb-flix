import React from 'react'


const Search =({searchTerm,setSearchTerm})=> {
  return (
    <div className='search'> 
    <div>
        <img src="../../public2/search.svg" alt="search" />

        <input 
         type='text'
         placeholder='Search through thousands of Movies'
         value={searchTerm}
         onChange={(e)=> setSearchTerm(e.target.value)}
        />

     </div>
    </div>



   
  )
}

// const person = {
//   name: 'John Doe',
//   age: 25
// } object cetaed which we can use further 
// function Search(props) {
//   return (
//     <div className='text-white text-3xl'>{props.searchTer}</div>
//   )
// } .    another way of doing the same thing is 

export default Search
