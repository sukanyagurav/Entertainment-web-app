import React from 'react'
import classes from './Pagination.module.css'
const Pagination = ({currentPage,setPage,totalPages}) => {
    if(totalPages === 0)return null
    function handlePrev(){
        if(currentPage !== 1){
            setPage(page=>page - 1)
        }
    }
    function handleNext(){
        if(currentPage !== totalPages){
            setPage(page=>page + 1)
        }
    }
  return (
    <div className={classes.pagination}>
      <button className={classes.btnPrev} onClick={handlePrev}>
        Prev
      </button>
      <span xlassName={classes.pageCount}>
        {currentPage} of {totalPages}
      </span>
      <button  className={classes.btnNext} onClick={handleNext}>
        Next
      </button>
    </div>
  )
}

export default Pagination
