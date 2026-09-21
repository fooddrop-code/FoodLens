import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [productName, setProductName] = useState('')
  const [servingSize, setServingSize] = useState('')
  const [servingUnit, setServingUnit] = useState('g')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [sugar, setSugar] = useState('')
    const [fat, setFat] = useState('')
  const [products, setProducts] = useState(() => {
  const savedProducts = localStorage.getItem('foodlens-products')

    return savedProducts ? JSON.parse(savedProducts) : []
  })
  const [errorMessage, setErrorMessage] = useState('')
   useEffect(() => {
      localStorage.setItem('foodlens-products', JSON.stringify(products))
  }, [products])

  function addProduct() {
    const numericServingSize = Number(servingSize)

    if (!productName.trim()) {
      setErrorMessage('제품명을 입력하세요.')
      return
    }

    if (!numericServingSize || numericServingSize <= 0) {
      setErrorMessage('0보다 큰 표시 기준량을 입력하세요.')
      return
    }

          if (calories === '' || fat === '' || sugar === '' || protein === '') {
      setErrorMessage('열량, 지방, 당류, 단백질 값을 모두 입력하세요.')
      return
    }

    const newProduct = {
      name: productName,
      servingSize,
      servingUnit,
      calories,
      sugar,
      protein,
      fat,
    }

    setProducts([...products, newProduct])
    setProductName('')
    setServingSize('')
    setServingUnit('g')
    setCalories('')
    setSugar('')
    setProtein('')
    setFat('')
    setErrorMessage('')
  }

  function removeProduct(indexToRemove) {
    setProducts(
      products.filter((_, index) => index !== indexToRemove)
    )
  }

  function calculatePer100(value, currentServingSize) {
    const numericValue = Number(value)
    const numericServingSize = Number(currentServingSize)

    if (!numericServingSize) {
      return '–'
    }

    return ((numericValue / numericServingSize) * 100).toFixed(1)
  }

  return (
    <main>
      <h1>FoodLens</h1>
      <p>식품 제품 비교를 위한 R&D 분석 도구</p>

      <section>
        <h2>제품 추가</h2>

        <label htmlFor="product-name">제품명</label>
        <input
          id="product-name"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="예: 단백질 음료"
        />

        <label htmlFor="serving-size">표시 기준량</label>
        <input
          id="serving-size"
          type="number"
          value={servingSize}
          onChange={(event) => setServingSize(event.target.value)}
          placeholder="예: 250"
        />

        <label htmlFor="serving-unit">기준량 단위</label>
        <select
          id="serving-unit"
          value={servingUnit}
          onChange={(event) => setServingUnit(event.target.value)}
        >
          <option value="g">g</option>
          <option value="mL">mL</option>
        </select>

        <label htmlFor="calories">열량 (kcal)</label>
        <input
          id="calories"
          type="number"
          value={calories}
          onChange={(event) => setCalories(event.target.value)}
          placeholder="예: 150"
        />

        <label htmlFor="fat">지방 (g)</label>
        <input
          id="fat"
          type="number"
          min="0"
          value={fat}
          onChange={(event) => setFat(event.target.value)}
          placeholder="예: 3"
        />

        <label htmlFor="sugar">당류 (g)</label>
        <input
          id="sugar"
          type="number"
          min="0"
          value={sugar}
          onChange={(event) => setSugar(event.target.value)}
          placeholder="예: 5"
        />

        <label htmlFor="protein">단백질 (g)</label>
        <input
          id="protein"
          type="number"
          value={protein}
          onChange={(event) => setProtein(event.target.value)}
          placeholder="예: 20"
        />

        <button type="button" onClick={addProduct}>
          제품 목록에 추가
        </button>

        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}
      </section>

      <section>
        <h2>100단위 기준 비교</h2>
        <p>g 기준 제품과 mL 기준 제품은 직접 비교하지 마세요.</p>

        {products.length === 0 ? (
          <p>아직 추가한 제품이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>제품명</th>
                <th>표시 기준량</th>
                <th>100단위당 열량</th>
                <th>100단위당 지방</th>
                <th>100단위당 당류</th>
                <th>100단위당 단백질</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={`${product.name}-${index}`}>
                  <td>{product.name}</td>
                  <td>
                    {product.servingSize} {product.servingUnit}
                  </td>
                  <td>
                    {calculatePer100(
                      product.calories,
                      product.servingSize
                    )}{' '}
                    kcal / 100{product.servingUnit}
                  </td>
                                    <td>
                                    
                    {calculatePer100(
                      product.sugar,
                      product.servingSize
                    )}{' '}
                    g / 100{product.servingUnit}
                  </td>
                  <td>
                    {calculatePer100(
                      product.protein,
                      product.servingSize
                    )}{' '}
                    g / 100{product.servingUnit}
                  </td>
                  <td>
                    {calculatePer100(
                      product.fat,
                      product.servingSize
                    )}{' '}
                    g / 100{product.servingUnit}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default App