'use client'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div 
                className={`
                    animate-spin 
                    rounded-full 
                    border-b-2 
                    border-blue-600
                    ${sizeClasses[size]}
                    ${className}
                `}
            />
        </div>
    )
}