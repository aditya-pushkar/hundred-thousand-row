/**
 * repilicate/simulate a  DB query with pagination
*/


export async function GET(request) {
    const TOTAL_INTEGER = 100000
    const INTEGER_PER_PAGE = 500 //total integer in single page
    const TOTAL_PAGE = TOTAL_INTEGER/INTEGER_PER_PAGE //
    let nextPage = true

    const searchParams = request.nextUrl.searchParams
    let pageNumber = searchParams.get("page") || 1
    pageNumber =  Number(pageNumber)

    if(pageNumber>=TOTAL_PAGE) {
        nextPage = false
        // return Response.json({nextPage: nextPage, integers: [] })
    }

    /**
     * total integers for next page/pageNumber
     * EX: 2nd page so total int = 500, current ints = pageNum*total int = 2*500 = 1000-INTEGER_PER_PAGe bcs we have to go from smaller tp bigger nmber, from where to thousda so = 1000 - INTEGER_PER_PAGE  in this case 500, so we will make array 500-1000
     */
    const currentInts = []
    for (let int = (pageNumber*INTEGER_PER_PAGE)-INTEGER_PER_PAGE; int<pageNumber*INTEGER_PER_PAGE; int++) {
    currentInts.push(int)
    }


    // refactor if no next page then nest page num should be null
   return Response.json({nextPageNum: pageNumber+1, nextPage: nextPage, integers: currentInts })
}