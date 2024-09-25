export async function POST(request) {
  const res = await request.json();
  const { integers } = res;

  
  // Loop through all the integer and return with tere square
  const sqr = await Promise.all(integers.map((n)=>{
    return {int:n, sqr:n**2}
  }));

   // Delaying the execution by 2 seconds using setTimeout
   await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });

  return Response.json({ sqrs: sqr });
}

/**
 * OPTIMIZE FOR BATCHING
 * 1-100000 in array or somethign
 * we have to track current integer, previous ? in case of 1-1000 no after that yes, have_next ? in 99000-100000 no
 *
 */
