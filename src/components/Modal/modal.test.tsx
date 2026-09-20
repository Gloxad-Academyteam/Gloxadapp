import { render } from "@testing-library/react"
import Modal from "."

describe("Test modal component", ()=>{
test("expect modal renders content correctly", async()=>{
    let newElement = document.createElement("div")
    newElement.setAttribute("id", "modal")
    document.body.append(newElement)
    
    const {getByTestId, getByText} =  render(<Modal>
        <div data-testid="modal-cont">
        Hello world
        </div>
    </Modal>)
    expect(getByTestId(/modal-cont/i)).toBeInTheDocument()
    expect(getByText("Hello world")).toBeInTheDocument()
    })
})