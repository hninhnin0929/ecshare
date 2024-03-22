import Link from 'next/link'

const Header = () => {
    return (
        <nav className='flex justify-between items-center bg-blue-600 px-8 py-4'>
            <div>
                Logo
            </div>
            <div className='flex items-center space-x-6 ml-auto'>
                <Link className='text-white mr-6' href={"/"}>SIGN UP</Link>
                <Link className='text-white' href={"/"}>LOG IN</Link>
            </div>
        </nav>
    )
}

export default Header