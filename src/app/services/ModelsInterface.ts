
export interface Service {
  icon: string,
  title: string,
}

export interface Project {
  id: string
  title: string,
  description: string,
  image: {
    public_id: string,
    url: string
  },
  links: {
    github: string | null,
    app: string | null
  }
  createdAt: string
}

export interface Technical {
  id: string
  name: string,
  type: string,
  percentage: number,
  image: {
    public_id: string,
    url: string
  }
  createdAt: string
}

export interface Professional {
  id: string
  name: string,
  icon: string
  createdAt: string
}


export interface About {
  id: string
  date: string,
  title: string,
  description: string,
  createdAt: string
}


export interface Message {
  id: string
  name: string,
  lastName: string,
  phone: string,
  email: string,
  message: string
  createdAt: string
}