export const themeClasses = {
    text: {
        light: 'text-zinc-900',
        dark: 'text-zinc-50'
    },
    text_description: {
        light: 'text-zinc-500',
        dark: 'text-zinc-200'
    },
    background: {
        light: 'bg-white',
        dark: 'bg-zinc-900'
    },
    background_secondary: {
        light: 'bg-white',
        dark: 'bg-background_secondary'
    },
    background_dark_gradient: {
        light: 'bg-white',
        dark: 'bg-gradient-to-tl from-blue-950 from-10% to-background_secondary to-50% text-zinc-50'
    },
    background_popup: {
        light: 'bg-gradient-to-t from-zinc-100 from-10% to-background_secondary to-50%',
        dark: 'bg-zinc-900'
    },
    background_head_table: {
        light: 'bg-blue-300',
        dark: 'bg-blue-600'
    },
    background_body_table: {
        light: 'bg-white',
        dark: 'bg-zinc-950'
    },
    background_secondary_head_table: {
        light: 'bg-blue-100',
        dark: 'bg-blue-500'
    },    
    background_third_head_table: {
        light: 'bg-zinc-100',
        dark: 'bg-background_secondary'
    },
    background_card: {
        light: 'bg-white',
        dark: 'bg-zinc-800'
    },
    background_icon: {
        light: 'bg-zinc-100',
        dark: 'bg-zinc-800'
    },
    border: {
        light: 'border border-zinc-300',
        dark: 'border border-zinc-200'
    },
    hover: {
        light: 'hover:bg-zinc-100',
        dark: 'hover:bg-zinc-700'
    }
} as const