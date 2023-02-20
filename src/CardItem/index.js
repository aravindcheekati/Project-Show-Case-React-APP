import './index.css'

const CardItem = props => {
  const {item} = props
  const {imgUrl, name} = item
  return (
    <li className="projects-li">
      <img src={imgUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default CardItem
