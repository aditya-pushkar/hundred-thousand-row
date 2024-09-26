/**
 * Simulating a  DB query with pagination
*/


export async function GET(request) {
    const TOTAL_INTEGER = 100000
    const INTEGER_PER_PAGE = 500 //total integer in single page
    const TOTAL_PAGE = TOTAL_INTEGER/INTEGER_PER_PAGE //200
    let nextPage = true

    const searchParams = request.nextUrl.searchParams
    let pageNumber = searchParams.get("page") || 1
    pageNumber =  Number(pageNumber)

    //if next page is the ladt page, the we have to inform the user
    if(pageNumber>=TOTAL_PAGE) {
        nextPage = false
    }

    /**
     *  For getting positive integers from increasing order
     *  for (let int = (1*500)-500; int<1*500; int++)
     *  for (let int = (500)-500; int<1*500; int++)
     *  for (let int = 0; int<500; int++)
    */
    const currentInts = []
    for (let int = (pageNumber*INTEGER_PER_PAGE)-INTEGER_PER_PAGE; int<pageNumber*INTEGER_PER_PAGE; int++) {
    currentInts.push(int)
    }

    // if this is the last page, return response with these values
    if(pageNumber>TOTAL_PAGE){
        return Response.json({nextPageNum: null, nextPage: false, integers: [] })
    }


   return Response.json({nextPageNum: nextPage&&pageNumber+1, nextPage: nextPage, integers: currentInts })
}