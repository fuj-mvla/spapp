



const Navbar = ({navigate,navigateP}) =>{
        return(
            <div className=" relative bg-white w-screen h-20">
                <a className= "relative  top-0  h-full pl-8 hover:text-red-500 text-2xl "href='https://www.specialolympics.org/' target = "_blank">Main Page</a>
                <button className="relative  top-0  h-full pl-8 hover:text-red-500 text-2xl" onClick={navigate}>Home</button>
                <button className="relative  top-0  h-full pl-8 hover:text-red-500 text-2xl" onClick={navigateP}>Profile</button>
                <button className="relative  top-0  h-full pl-8 hover:text-red-500 text-2xl">Coaches</button>
                <hr></hr>
            </div>
        );
}

export default Navbar