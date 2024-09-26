export async function POST(request) {
  const res = await request.json();

  // Array of integers 
  const { integers } = res;

  
  // Loop through all the integers and return an array with integers and their square.
  const sqr = await Promise.all(integers.map((n)=>{
    return {int:n, sqr:n**2}
  }));

   // Delaying the execution by 2 seconds
   await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return Response.json({ sqrs: sqr });
}
